import {pgTable, text, uuid, integer, boolean,timestamp} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm"

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  //basic filer folder info
  name: text("name").notNull(),
  path: text("path").notNull(), //something like documets/home/abc.png
  size: integer("size").notNull(),
  type:text("type").notNull(), //"folder"

   //storage info
   fileUrl: text("file_url").notNull(), // url to access file
   thumbnailUrl: text("thumbnail_url"), // url to access thumbnail can be null

   // Ownership who is the parent
   userId: text("user_id").notNull(),
   parentId: uuid("parent_id"), //parent folder id null for root items

   // file/folder flags , later on we can use filters to just show those files which are not in trash, are starred etc
   isFolder: boolean("is_folder").notNull().default(false),
   isStarred: boolean("is_starred").notNull().default(false),
   isTrash: boolean("is_trash").notNull().default(false),

   //Timestamps
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().notNull(),
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


// Type definitions 

export const File = typeof files.$inferSelect; //infer the selection which is good for me so that i can use it in the editor which understands this type as i am usimg ts
export const NewFile = typeof files.$inferInsert; //infer the insertion which is good for me