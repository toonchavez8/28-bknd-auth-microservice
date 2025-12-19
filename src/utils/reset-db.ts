import { config } from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";

config();
async function resetDatabase() {
    // Create a connection WITHOUT synchronize to avoid auto-sync on connect
    const dataSource = new DataSource({
        type: "mssql",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false,  // Don't auto-sync on connect
        logging: false,
        entities: [User],
        options: {
            instanceName: process.env.DB_INSTANCE,
            trustServerCertificate: true,
            encrypt: false,
        }
    });

    try {
        await dataSource.initialize();
        console.log('Connected to database...');
        
        const queryRunner = dataSource.createQueryRunner();
        
        console.log('Dropping all tables...');
        
        // Drop the user table
        await queryRunner.query(`
            IF OBJECT_ID('dbo.user', 'U') IS NOT NULL 
            DROP TABLE dbo.[user];
        `);
        
        console.log('Tables dropped successfully!');
        
        // Now manually synchronize to recreate with new schema
        console.log('Recreating tables...');
        await dataSource.synchronize();
        
        console.log('Database reset complete!');
        
        await queryRunner.release();
        await dataSource.destroy();
        
    } catch (error) {
        console.error('Error resetting database:', error);
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
        process.exit(1);
    }
}

resetDatabase();