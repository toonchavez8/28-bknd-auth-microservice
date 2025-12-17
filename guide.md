# Step-by-Step Implementation Guide

## Authentication Microservice with TypeORM

---

## 📋 Current Project Status

### ✅ Already Completed

- [x] Project structure created
- [x] Dependencies installed (Express, TypeORM, bcrypt, jsonwebtoken, dotenv)
- [x] TypeScript configured
- [x] Basic Express server set up in `index.ts`
- [x] Database connection configured in `app-data-source.ts` (SQL Server)
- [x] Basic User entity created
- [x] Test endpoints exist (GET `/users`, GET `/users/:id`)

### 🔧 What Needs to be Done

Follow the steps below to complete your authentication microservice.

---

## Phase 1: Environment & Configuration Setup

### Step 1: Configure Environment Variables

- [x] Create a `.env` file in the root directory (if not exists)
- [x] Add the following environment variables:
  - `PORT` - Server port (e.g., 3000)
  - `DB_HOST` - Database host
  - `DB_PORT` - Database port
  - `DB_USERNAME` - Database username
  - `DB_PASSWORD` - Database password
  - `DB_DATABASE` - Database name
  - `DB_INSTANCE` - SQL Server instance name (if applicable)
  - `JWT_SECRET` - Secret key for JWT signing (generate a strong random string)
  - `JWT_EXPIRATION` - Token expiration time (e.g., "1d" or "24h")

### Step 2: Update User Entity

- [ ] Open `src/entities/user.entity.ts`
- [ ] Modify the entity to match requirements:
  - Change `@PrimaryGeneratedColumn()` to `@PrimaryGeneratedColumn("uuid")` for UUID primary key
  - Add `@Column({ unique: true })` to the `email` field
  - Change `createdAt` column to use `@CreateDateColumn()` decorator instead of regular `@Column()`
  - Consider adding `@UpdateDateColumn()` for an `updatedAt` field

### Step 3: Update Database Configuration

- [ ] Open `src/utils/app-data-source.ts`
- [ ] Add the User entity to the `entities` array in the DataSource configuration
- [ ] Verify `synchronize: true` is set (for development only)
- [ ] Consider adding error handling

---

## Phase 2: Service Layer (Business Logic)

### Step 4: Create Authentication Service

- [ ] Create file: `src/services/auth.service.ts`
- [ ] Plan to implement the following methods:
  - `registerUser(username, email, password)` - Handles user registration logic
  - `loginUser(email, password)` - Handles authentication logic
  - `hashPassword(password)` - Uses bcrypt to hash passwords (10+ rounds)
  - `comparePasswords(plainPassword, hashedPassword)` - Verifies password
  - `generateToken(payload)` - Creates JWT with user data

### Step 5: Implement User Registration Logic

- [ ] In `registerUser` method, plan to:
  - Validate input fields (username, email, password not empty)
  - Check if email already exists in database
  - Hash the password using bcrypt
  - Create new User entity instance
  - Save user to database
  - Return success response with userId (no password data)

### Step 6: Implement Login Logic

- [ ] In `loginUser` method, plan to:
  - Find user by email
  - Return error if user not found
  - Compare provided password with stored hash
  - Return error if passwords don't match
  - Generate JWT token with user id and email
  - Set token expiration from environment variable
  - Return token with metadata (tokenType: "Bearer", expiresIn)

---

## Phase 3: Controller Layer (Request Handling)

### Step 7: Create Authentication Controller

- [ ] Create file: `src/controllers/auth.controller.ts`
- [ ] Plan to implement controller methods:
  - `register` - Handles POST `/api/auth/register` requests
  - `login` - Handles POST `/api/auth/login` requests

### Step 8: Implement Register Controller

- [ ] In `register` method, plan to:
  - Extract `username`, `email`, `password` from request body
  - Validate that all fields are provided (return 400 if missing)
  - Call the auth service's `registerUser` method
  - Handle errors appropriately:
    - 409 Conflict if email already exists
    - 500 Internal Server Error for other errors
  - Return 201 Created with success message and userId

### Step 9: Implement Login Controller

- [ ] In `login` method, plan to:
  - Extract `email` and `password` from request body
  - Validate that both fields are provided (return 400 if missing)
  - Call the auth service's `loginUser` method
  - Handle errors appropriately:
    - 401 Unauthorized if credentials are invalid
    - 500 Internal Server Error for other errors
  - Return 200 OK with accessToken, tokenType, and expiresIn

---

## Phase 4: Routes Configuration

### Step 10: Create Authentication Routes

- [ ] Create file: `src/routes/auth.routes.ts`
- [ ] Plan to:
  - Import Express Router
  - Import auth controller methods
  - Define POST route for `/register` → calls register controller
  - Define POST route for `/login` → calls login controller
  - Export the router

### Step 11: Update Main Server File

- [ ] Open `src/index.ts`
- [ ] Import the auth routes
- [ ] Mount the routes at `/api/auth` prefix
- [ ] Remove or comment out test endpoints (GET `/users`, GET `/users/:id`)
- [ ] Keep the root GET `/` endpoint for health checks

---

## Phase 5: Middleware (Optional but Recommended)

### Step 12: Create JWT Authentication Middleware

- [ ] Create file: `src/middleware/auth.middleware.ts`
- [ ] Plan to implement:
  - Extract token from Authorization header (format: "Bearer <token>")
  - Verify token using jsonwebtoken and JWT_SECRET
  - Decode token payload
  - Attach user data to request object
  - Call next() if valid, return 401 if invalid

### Step 13: Create Validation Middleware

- [ ] Create file: `src/middleware/validation.middleware.ts`
- [ ] Plan to implement validators for:
  - Email format validation (basic regex)
  - Password strength validation (minimum length, complexity)
  - Required fields validation
  - Return 400 Bad Request with descriptive errors

### Step 14: Create Error Handler Middleware

- [ ] Create file: `src/middleware/error.middleware.ts`
- [ ] Plan to implement:
  - Centralized error handling
  - Proper HTTP status codes
  - Consistent error response format
  - Log errors for debugging

### Step 15: Apply Middleware to Routes

- [ ] Open `src/routes/auth.routes.ts`
- [ ] Add validation middleware to register and login routes
- [ ] Open `src/index.ts`
- [ ] Add error handler middleware as the last middleware

---

## Phase 6: Testing & Refinement

### Step 16: Manual Testing Preparation

- [ ] Ensure database is running and accessible
- [ ] Verify all environment variables are set
- [ ] Run the development server using `npm run dev`
- [ ] Check console for any startup errors

### Step 17: Test User Registration

- [ ] Use Postman, Thunder Client, or curl to test
- [ ] Send POST request to `http://localhost:3000/api/auth/register`
- [ ] Include JSON body with username, email, password
- [ ] Verify 201 response with userId
- [ ] Try registering with same email (should get 409 Conflict)
- [ ] Try with missing fields (should get 400 Bad Request)

### Step 18: Test User Login

- [ ] Send POST request to `http://localhost:3000/api/auth/login`
- [ ] Include JSON body with email and password (use registered user)
- [ ] Verify 200 response with valid JWT token
- [ ] Try with wrong password (should get 401 Unauthorized)
- [ ] Try with non-existent email (should get 401 Unauthorized)

### Step 19: Verify JWT Token

- [ ] Copy the accessToken from login response
- [ ] Decode it using jwt.io to verify payload contains id and email
- [ ] Check that expiration is set correctly (24 hours)
- [ ] Verify token is properly signed

### Step 20: Database Verification

- [ ] Connect to your database using a database client
- [ ] Query the User table
- [ ] Verify that:
  - Users are created with UUID ids
  - Emails are unique
  - Passwords are hashed (not plain text)
  - createdAt timestamps are set

---

## Phase 7: Security & Best Practices

### Step 21: Security Checklist

- [ ] Ensure JWT_SECRET is strong and not committed to git
- [ ] Verify bcrypt salt rounds are at least 10
- [ ] Confirm passwords are never returned in API responses
- [ ] Check that sensitive data is not logged
- [ ] Add `.env` to `.gitignore`

### Step 22: Code Quality Review

- [ ] Review all files for TypeScript type safety
- [ ] Ensure proper error handling in all async functions
- [ ] Check that all promises are awaited
- [ ] Verify consistent code formatting

### Step 23: Documentation

- [ ] Add comments to complex logic
- [ ] Document expected request/response formats
- [ ] Update README with API usage examples
- [ ] Document environment variables

---

## Phase 8: Production Preparation (Future)

### Step 24: Production Considerations (Not Implemented Yet)

- [ ] Change `synchronize: false` in production DataSource
- [ ] Set up proper database migrations
- [ ] Add rate limiting middleware
- [ ] Implement refresh tokens
- [ ] Add request logging
- [ ] Set up proper environment configurations (dev, staging, prod)
- [ ] Add health check endpoint
- [ ] Implement proper logging system (Winston, Pino)

### Step 25: Optional Enhancements

- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add user profile endpoints (protected routes)
- [ ] Add role-based access control (RBAC)
- [ ] Implement logout/token blacklisting
- [ ] Add input sanitization
- [ ] Set up automated testing (Jest, Supertest)

---

## 📁 Final Project Structure

After completing all steps, your project should look like this:

```
/src
  index.ts                        ← Main server file with routes mounted
  /controllers
    auth.controller.ts            ← Request handlers for auth endpoints
  /entities
    user.entity.ts                ← Updated User entity with proper decorators
  /middleware
    auth.middleware.ts            ← JWT verification middleware
    validation.middleware.ts      ← Input validation middleware
    error.middleware.ts           ← Centralized error handler
  /routes
    auth.routes.ts                ← Auth endpoint definitions
  /services
    auth.service.ts               ← Business logic for authentication
  /utils
    app-data-source.ts            ← TypeORM configuration
```

---

## 🎯 Success Criteria

Your authentication microservice is complete when:

1. ✅ Users can successfully register with unique emails
2. ✅ Passwords are securely hashed in the database
3. ✅ Users can log in with correct credentials
4. ✅ Valid JWT tokens are returned upon login
5. ✅ Proper HTTP status codes are returned for all scenarios
6. ✅ No sensitive data is exposed in responses
7. ✅ Environment variables are properly configured
8. ✅ Code follows TypeORM and Express best practices

---

## 💡 Tips for Implementation

- **Work incrementally**: Complete one phase before moving to the next
- **Test as you go**: Don't wait until the end to test functionality
- **Use TypeScript types**: Define interfaces for request bodies and responses
- **Handle errors gracefully**: Every async operation should have try-catch
- **Keep it simple first**: Get basic functionality working before adding enhancements
- **Check the console**: Server logs will help you debug issues
- **Commit frequently**: Use git to track your progress

---

## 🆘 Common Issues to Watch For

1. **Database connection fails**: Double-check environment variables and database status
2. **JWT_SECRET not set**: Will cause token generation/verification to fail
3. **Bcrypt rounds too high**: Can cause slow response times (10-12 is optimal)
4. **Synchronize in production**: Never use `synchronize: true` in production
5. **Missing await keywords**: Will cause unexpected behavior with async operations
6. **Circular dependencies**: Import order matters, especially with TypeORM

---

Good luck with your implementation! 🚀
