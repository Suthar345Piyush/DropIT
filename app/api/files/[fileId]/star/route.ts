import {db} from  "@/lib/db";
import {auth} from "@clerk/nextjs/server";
import {files} from "@/lib/db/schema";
import {eq , and} from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request : NextRequest,
   // props is  next js and typescript practice , it returns a promise
   props : {params : Promise<{fileId : string}>}
){
   
     try{
   const  {userId} = await auth();
    if(!userId){
       return NextResponse.json({
         error : "Unauthorized"
       } , {status : 401});
    }

    const {fileId} = await props.params;

    if(!fileId){
      return NextResponse.json({
         error : "File id is  required"
      } , {status : 401});
    }

    const [file] = await db.select().from(files).where(
        and (
           eq(files.id ,  fileId),
           eq(files.userId , userId),
        )
    )

// check for  file  

      if(!file){
         return NextResponse.json({
           error : "File not found"
         } , {status : 401});
      }

      // toggle the  star symbol/icon 

 const updatedFiles = await db.update(files).set({isStarred : !file.isStarred}).where(
        and(
           eq(files.id , fileId),
           eq(files.userId , userId)
        )
      ).returning();
    
       const updatedFile = updatedFiles[0];

       return NextResponse.json(updatedFile);

     } catch(error){ 
        return NextResponse.json({
           error : "Failed to update file"
        } , {status : 500}); 
       
     }
}

