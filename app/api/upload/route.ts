// for uploading the files  on the imagekit , the POST request  is  used  

import { db } from "@/lib/db";
import {files, newFile} from "@/lib/db/schema";
import {auth} from  "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// this  is  on post endpoint 

export async function POST(request : NextRequest) {
   try{
     const  {userId} = await auth();
     if(!userId) {
       return NextResponse.json({error : "Unauthorized"} , {status : 401});
     }     
   
     // parse request  body 
     // all the data comes  here  
     
     const body = await request.json();
     const {imagekit , userId : bodyUserId} = body

     //somebody else is trying to upload the data , not actual user (check)

     if(bodyUserId !== userId) {
       return NextResponse.json({error : "Unauthorized"} , {status : 401});
     }

     //check on image kit data that coming up 

     if(!imagekit || !imagekit.url){
      return NextResponse.json({error : "Invalid file upload data"} , {status : 401});
     }

     // all the file  data , for this  we have the imagekit as a whole object

     const fileData = {
       name : imagekit.name || "Untitled",
       path : imagekit.filePath || `/dropit/${userId}/${imagekit.name}`,
       size : imagekit.size || 0,
       type : imagekit.fileType || "image",
       fileUrl : imagekit.url,
       thumbnailUrl : imagekit.thumbnailUrl || null,
       userId : userId,
       parentId : null,  //root level by default 
       isFolder : false,
       isStarred : false,
       isTrash : false,
     };

     // insert the file  into record 

     const [newFile] = await db.insert(files).values(fileData).returning()
     return NextResponse.json(newFile);

   } catch(error){ 
        return NextResponse.json(
          {
            error : "Failed to save info to database",
          },
          {status : 500}
        );
   }
}

