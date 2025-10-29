import {migrate} from "drizzle-orm/neon-http/migrator";
import {drizzle} from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless";

import * as dotenv from "dotenv"
import { error } from "console";

dotenv.config({path :".env"});

if(!process.env.DATABASE_URL){
    throw new Error("Database url is not in .env");
}

async function runMigration() {
    try{
        const sql = neon(process.env.DATABASE_URL!); 
        const db = drizzle(sql);

        await migrate(db,{migrationsFolder :"./drizzle" });
        console.log("all migrations are successfully done");
        
    } catch(error){
             console.log("error in migrations");
             process.exit(1);
    }
}

runMigration();