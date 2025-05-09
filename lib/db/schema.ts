import  {pgTable , text , uuid , integer , boolean} from "drizzle-orm/pg-core";
import  { relations } from "drizzle-orm";



export const files = pgTable("files" , {
    // unique id  

    id : uuid("id").defaultRandom().primaryKey(),

    //basic  file & folder  information 
    
    name : text("name").notNull(),
    path : text("path").notNull(),
    size : integer("size").notNull(),
    type : text("type").notNull(),  // "folder" or "file"
    

})