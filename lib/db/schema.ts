import {pgTable, text, uuid, integer, boolean,timestamp} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm"

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  //basic filer folder info
  name: text("name").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  type:text("type").notNull(), //"folder"

   //storage info
   fileUrl: text("file_url").notNull(), // url to access file
   thumbnailUrl: text("thumbnail_url"), // url to access thumbnail

   // Ownership
   userId: text("user_id").notNull(),
   parentId: uuid("parent_id"), //parent folder id null for root items

   // file/folder flags
   isFolder: boolean("is_folder").notNull().default(false),
   isStarred: boolean("is_starred").notNull().default(false),
   isTrash: boolean("is_trash").notNull().default(false),

   //Timestamps
   createdAt: timestamp("created_at").notNull().defaultNow().notNull(),
   updatedAt: timestamp("updated_at").notNull().defaultNow().notNull(),
})

/*
parent: each file can have one parent folder
children: each folder can have many children that can be files/folder
*/

export const filesRelations = relations(files, ({one ,many}) => ({
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id],
    }),

    //relationship to child file/folder
    children: many(files),
}))


// Type definations 

export const File = typeof files.$inferSelect; //infer the selection which is good for me
export const NewFile = typeof files.$inferInsert; //infer the insertion which is good for me