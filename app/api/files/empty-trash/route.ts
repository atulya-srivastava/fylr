import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Delete all files that are in trash for this user
        const deletedFiles = await db.delete(files).where(
            and(
                eq(files.userId, userId),
                eq(files.isTrash, true)
            )
        ).returning();

        return NextResponse.json({ 
            success: true,
            message: "Trash emptied successfully",
            deletedCount: deletedFiles.length
        });

    } catch (error) {
        console.error("Error emptying trash:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
