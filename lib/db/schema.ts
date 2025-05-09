import  {pgTable , text , uuid , integer , boolean , timestamp} from "drizzle-orm/pg-core";
import  { relations } from "drizzle-orm";
import { Children } from "react";



export const files = pgTable("files" , {
    // unique id  

    id : uuid("id").defaultRandom().primaryKey(),

    //basic  file & folder  information 
    
    name : text("name").notNull(),
    path : text("path").notNull(),   // /document/project/resume.pdf
    size : integer("size").notNull(),
    type : text("type").notNull(),  // "folder" or "file"
   

    //storage information 

    fileUrl : text("file_url").notNull(),   // url to access file 
    thumbnailUrl : text("thumbnail_url"),

    //OwnerShip information (about user)

    userId : text("user_id").notNull(),
    parentId : uuid("parent_id"),  // parent folder if (otherwise null for root items)

    //boolean flags (file / folder)

 // treat everything as a file , but if this flag is true , then it  is  folder 
    isFolder : boolean("is_folder").default(false).notNull(),
    isStarred : boolean("is_starred").default(false).notNull(),
    isTrash : boolean("is_trash").default(false).notNull(),


    // time stamps 

    createdAt : timestamp("created_at").defaultNow().notNull(),
    updatedAt : timestamp("updated_at").defaultNow().notNull(),
})


//making relations  using drizzle  ORM 
//making relations in hierarchy case 

/*
parent => Each file/folder can have one parent folder.

children => Each folder can have many child files/folder.
*/


export const  filesRelations  = relations(files , ({one , many}) => ({

  parent : one(files , {
     fields : [files.parentId],
     references : [files.id]
  }),




  //there could be many files(childrens) inside the folder  
  children : many(files)
}))   


//Type definations 
//$inferSelect , inferred the selection which is  good for me 


export const File = typeof files.$inferSelect