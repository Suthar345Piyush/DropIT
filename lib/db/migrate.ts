/* This is whole custom migration code just for understanding,
   this  whole thing can also be done by this command "npx drizzle-kit migrate"
*/


import  {migrate} from "drizzle-orm/neon-http/migrator";
import  {drizzle} from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless";


import * as dotenv from "dotenv";


dotenv.config({path : ".env.local"})

if(!process.env.DATABASE_URL){
  throw new Error("Database url is not set in .env.local");
}

async function runMigration() {
   try{
     // this  mark ! is from typescript , telling compiler that this is not null or undefined  
     const sql = neon(process.env.DATABASE_URL!)

   // initialize the connection 

   const db = drizzle(sql);

   // to run the migration , it will take time , it needs the connection string and where all it will go

   await migrate(db , {migrationsFolder : "./drizzle"});
   console.log("All migrations are successfully done");

   } 
   catch(error){
     console.log("All migrations are successfully done");
     //exiting the process with code 1
     process.exit(1);
   }
}



runMigration();


