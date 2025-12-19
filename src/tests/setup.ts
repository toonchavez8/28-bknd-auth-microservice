import { afterAll, beforeAll } from 'vitest';
import { AppDataSource } from '../utils/app-data-source';

let isInitialized = false;

beforeAll(async () => {
    if (isInitialized) {
        return;
    }
    
    console.log('Initializing database for tests...');
    
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('Database initialized successfully');
        isInitialized = true;
    }
    
    // Wait a bit for the connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 500));
});

afterAll(async () => {
    // Only close if this is truly the last suite
    // Vitest handles this automatically, so we can be more conservative
    if (AppDataSource.isInitialized) {
        console.log('Keeping database connection open for other test suites...');
    }
});

// Global teardown - this runs after ALL test files
process.on('beforeExit', async () => {
    if (AppDataSource.isInitialized) {
        console.log('Closing database connection...');
        await AppDataSource.destroy();
        console.log('Database connection closed');
    }
});