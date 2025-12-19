
import {afterAll, beforeAll} from 'vitest';
import { AppDataSource } from '../utils/app-data-source';


beforeAll(async () => {
    // Initialize the database connection before running tests
    if(!AppDataSource.isInitialized){
        await AppDataSource.initialize();
    }
})

afterAll( async () => {
    // Close the database connection after all tests are done
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});

