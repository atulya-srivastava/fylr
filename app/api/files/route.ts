import {files} from "@/lib/db/schema"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { eq,and, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

// Check if a parent folder (or any ancestor) is trashed
async function isParentTrashed(parentId: string | null, userId: string): Promise<boolean> {
    if (!parentId) return false;
    
    const [parent] = await db.select({ id: files.id, isTrash: files.isTrash, parentId: files.parentId })
        .from(files)
        .where(
            and(
                eq(files.id, parentId),
                eq(files.userId, userId),
            )
        );
    
    if (!parent) return false;
    if (parent.isTrash) return true;
    
    // Recursively check ancestors
    return isParentTrashed(parent.parentId, userId);
}

export async function GET(request: NextRequest){
    try {
        const {userId} = await auth()
        if(!userId){
            return  NextResponse.json({
                error:"Unauthorized access"
            },{status: 401});
        }
        const searchParams = request.nextUrl.searchParams;
        const queryUserId = searchParams.get("userId")
        const parentId = searchParams.get("parentId");
        
        if(!queryUserId || queryUserId !== userId){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status:401}
            );
        }

        //fetch files from database
        let userFiles;
        if(parentId){
            // fecth from a specific folder
        userFiles = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.userId, userId),
                        eq(files.parentId, parentId)
                    )
                )
        } else {
            userFiles = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.userId, userId),
                        isNull(files.parentId)
                    )
                )
        }

        // Check if we're inside a trashed folder - if so, all children should be treated as trashed
        const parentIsTrashed = parentId ? await isParentTrashed(parentId, userId) : false;
        
        // If the parent is trashed, mark all files as effectively trashed
        if (parentIsTrashed) {
            userFiles = userFiles.map(file => ({
                ...file,
                isTrash: true
            }));
        }

        return NextResponse.json(userFiles)
    } catch (error) {
        console.error("error fecthing",error)
        return NextResponse.json({error: "Failed to fetch files"},{status: 500});
    }
}