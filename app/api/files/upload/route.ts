import { db } from "@/lib/db";
import { files } from "@/lib/db/schema"
import { auth } from "@clerk/nextjs/server";
import {and,eq} from "drizzle-orm"
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";


//image kit credentials
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});


export async function POST(request: NextRequest){
    try {
         const { userId } = await auth();
            if (!userId) {
              return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            const formData = await request.formData();
            const file = formData.get("file") as File;
            const formUserId = formData.get("userId") as string
            const parentId = formData.get("parentId") as string ||  null

            if(formUserId !== userId){
                return NextResponse.json(
                    {error: "Unauthorized"},
                    {status: 401}
                )
            }

            if(!file){
                return NextResponse.json(
                    {error: "No file provided"},
                    {status: 401}
                )
            }

            if(parentId){
             const [parentFolder]  =  await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),
                        eq(files.userId, userId),
                        eq(files.isFolder, true)
                    )
                )

                if(!parentFolder){
                    return NextResponse.json({error:"Parent folder not found"},{status: 401})
                }
            } 
            
            // if(!parentId) return NextResponse.json({error:"Parent folder not found"},{status: 401})

            if(!file.type.startsWith("image/") && file.type !== "application/pdf"){
                return NextResponse.json({error:"Only images and pdfs are supported"},{status: 401})
            }

           const buffer =  await file.arrayBuffer()
           const fileBuffer = Buffer.from(buffer)

           const folderPath = parentId ? `/fylr/${userId}/folder/${parentId}`:`/fylr/${userId}`
           
           const originalFileName = file.name;
           const fileExtension = originalFileName.split(".").pop() || ""

           //check for empty extension
           //validation for not storing exe, php
           
           const uniqueFileName = `${uuidv4()}.${fileExtension}`

          const uploadResponse= await imagekit.upload({
            file: fileBuffer,
            fileName: uniqueFileName,
            folder: folderPath,
            useUniqueFileName: false
           })

           const fileData = {
            name: originalFileName,
            path: uploadResponse.filePath,
            size: file.size,
            type: file.type,
            fileUrl: uploadResponse.url,
            thumbailUrl: uploadResponse.thumbnailUrl || null,
            userId,
            parentId,
            isFolder: false,
            isStarred: false,
            isTrash: false
           }

           const [newFile]= await db.insert(files).values(fileData).returning()

           return NextResponse.json(newFile, {status: 200})
        
    } catch (_error) {
        return NextResponse.json({error:"Failed to upload file"},{status: 401})
    }
}