// API endpoints to upload on the image kit(through buffer , uploading the data like image,pdf etc..)

import { files } from "@/lib/db/schema";
import {auth} from "@clerk/nextjs/server";
import { eq , and } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";
import {db} from "@/lib/db";

// image kit important credentials 
const  imagekit = new ImageKit({
   publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
   privateKey : process.env.IMAGEKIT_PRIVATE_KEY || "",
   urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});



export  async function POST(request : NextRequest){
   try {
        const  {userId} = await auth();
        if(!userId){
           return NextResponse.json({
            error : "Unauthorized"
           } , {status : 401});
        }

        // parsing  the form data

        const formData = await request.formData()
        const file = formData.get("file") as File
        const formUserId = formData.get("userId") as string 
        const parentId = formData.get("parentId") as string || null;
        
        // match  the userid 

        if(formUserId !== userId){
          return NextResponse.json({
             error : "Unauthorized"
          } , {status  : 401});
        }

        // check if  file exist 

        if(!file){
          return NextResponse.json({
            error : "File doesn't exist"
          } , {status : 401});
        }  

        //passing the  parent id 
        if(parentId){
          // query the db 
          await db.select().from(files).where(
             and(
               eq(files.id , parentId),
               eq(files.userId , userId),
               eq(files.isFolder , true)
             )
          )
        } 

        // else {
        //    return NextResponse.json({
        //     error : "Parent folder not found"
        //    } , {status : 401});
        // }

        // this  can also be  done 

        if(!parentId){
          return NextResponse.json({
            error : "Parent folder not found"
          } , {status : 401});
        }


        // check for file is  image or  pdf 

        if(!file.type.startsWith("image/") && file.type !== "application/pdf"){
          return NextResponse.json({
            error : "Only image and pdf supported"
          } , {status : 401}); 
        }


      // convert the file into buffer 

  const buffer  = await file.arrayBuffer()
  const fileBuffer = Buffer.from(buffer)

  const folderPath = parentId ? `/dropit/${userId}/folder/${parentId}` : `/dropit/${userId}`

   // file name problem solved  
   const originalFilename = file.name;

   // checks for  empty extension

   const fileExtension = originalFilename.split(".").pop() || "";

   //validation for not storing .exe , .php extension files 

   const uniqueFilename = `${uuidv4()}.${fileExtension}`


       // upload the file  to imagekit
       
       await imagekit.upload({
         file : fileBuffer,
         fileName : uniqueFilename,
         folder :  folderPath,
         useUniqueFileName : false  // it  is  a type  of flag 
       })

       //creating the file data 

       const fileData = {
         
       }


      const [newFile] =  await db.insert(files).values(fileData).returning();


      return NextResponse.json(newFile);


   }catch(error){
       return NextResponse.json({
         error : "Failed to upload the file"
       } , {status : 401});
   }
}
  

