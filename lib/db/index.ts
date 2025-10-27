import {drizzle} from 'drizzle-orm/neon-http';
import {neon} from '@neondatabase/serverless';

import * as schema from "./schema" //import every export from the ./schema and bundle it into the schema object you have just written contains file, File and NewFile

const sql = neon(process.env.DATABASE_URL!); //from the env file 

export const db = drizzle(sql, {schema});

export {sql}; // this can be used to get the raw sql in the file incase it is needed to run
