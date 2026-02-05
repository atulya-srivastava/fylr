import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Recursively get all descendant file/folder IDs
async function getAllDescendantIds(parentId: string, userId: string): Promise<string[]> {
    const children = await db.select({ id: files.id, isFolder: files.isFolder }).from(files).where(
        and(
            eq(files.parentId, parentId),
            eq(files.userId, userId),
        )
    );

    let descendantIds: string[] = [];
    
    for (const child of children) {
        descendantIds.push(child.id);
        if (child.isFolder) {
            const grandchildren = await getAllDescendantIds(child.id, userId);
            descendantIds = descendantIds.concat(grandchildren);
        }
    }
    
    return descendantIds;
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ fileId: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { fileId } = await props.params;

        if (!fileId) {
            return NextResponse.json(
                { error: "File Id is required" },
                { status: 400 }
            );
        }

        const [file] = await db.select().from(files).where(
            and(
                eq(files.id, fileId),
                eq(files.userId, userId),
            )
        );

        if (!file) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        const newTrashStatus = !file.isTrash;

        // Toggle trash status for the file/folder itself
        const updatedFiles = await db.update(files).set({ isTrash: newTrashStatus }).where(
            and(
                eq(files.id, fileId),
                eq(files.userId, userId),
            )
        ).returning();

        const updatedFile = updatedFiles[0];

        // If it's a folder, also update all descendants
        if (file.isFolder) {
            const descendantIds = await getAllDescendantIds(fileId, userId);
            if (descendantIds.length > 0) {
                await db.update(files).set({ isTrash: newTrashStatus }).where(
                    and(
                        inArray(files.id, descendantIds),
                        eq(files.userId, userId),
                    )
                );
            }
        }

        return NextResponse.json(updatedFile);

    } catch (error) {
        console.error("Error toggling trash status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
