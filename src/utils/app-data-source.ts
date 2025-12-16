import {DataSource} from 'typeorm';

export const AppDataSource = new DataSource({
    type:"mssql",
    host:"localhost",
    port:4096,
    username:"sa",
    password:"1234",
    database:"AuthMicroserviceDB",
    synchronize:true,
    logging:false,
    entities:["src/Entities/*.ts"],
});