import { drizzle } from 'drizzle-orm/neon-http';
import {neon} from '@neondatabase/serverless';
import * as schema from  './schema';



const  sql = neon(process.env.DATABASE_URL!);


export const db  = drizzle(sql , {schema});

//we can export the sql as object as well 
export {sql};




