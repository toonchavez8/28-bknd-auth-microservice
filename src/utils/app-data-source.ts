
import {DataSource} from 'typeorm';
import { User } from '../entities/user.entity';


export const AppDataSource = new DataSource({
    type:"mssql",
    host:process.env.DB_HOST,
    port:process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    synchronize:true,
    logging:false,  // Enable to see SQL queries for debugging
    entities: [User],  
    options: {
        instanceName: process.env.DB_INSTANCE,
        trustServerCertificate: true,  // Required for local development
    }
});