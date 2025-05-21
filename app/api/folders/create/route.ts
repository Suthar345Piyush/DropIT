import  {db} from "@/lib/db";
import {files} from "@/lib/db/schema";
import {auth} from "@clerk/nextjs/server";
import  { v4 as uuidv4 } from "uuid";

// some  methods comes from drizzle orm , for checking
import {eq , and} from "drizzle-orm"  ;
import { NextRequest, NextResponse } from "next/server";

export async function POST(request : NextRequest){

   // verification part  
   try{
      const  {userId} = await auth();
      // user Id from backend 
      if(!userId) {
         return NextResponse.json({
           error : "Unauthorized"
         } , {status : 401});
      }

      const body = await request.json();
      // this  bodyUserId is from frontend 
      const  {name , userId : bodyUserId , parentId  = null} = body
     
       if(bodyUserId !== userId){
           return NextResponse.json(
             {error : "Unauthorized"},
             {status : 401}
           );
       }

       // folder name validation 
       if(!name || typeof name !== "string" || name.trim() === ""){
         return NextResponse.json(
           {error : "Folder name is  required"},
           {status : 400}
         );
       }

       // if we have a parentId , then we move forward 
         if(parentId){
        const [parentFolder] = await db.select().from(files).where(
             and(
              eq(files.id , parentId),
              eq(files.userId , userId),
              eq(files.isFolder , true)
             )
           )
           if(!parentFolder){
             return NextResponse.json({
              error : "Parent Folder not found"
             } , {status : 401})
           }
         }

         // creating a folder in db
         
         const folderData = {
            id: uuidv4(),
            name : name.trim(),
            path : `/folders/${userId}/${uuidv4()}`,
            size : 0,
            type : "folder",
            fileUrl : "",
            thumbnailUrl : null,
            userId,
            parentId,
            isFolder : true,
            isStarred :  false,
            isTrash : false,
        };




        const [newFolder] =  await db.insert(files).values(folderData).returning();

        return NextResponse.json({
          success : true,
          message : "Folder created successfully",
          folder : newFolder
        })
   } catch(error){

   }  
}