


export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthenticationError";
    }
}

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";
    }   
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}
export class DuplicateError extends Error {
    constructor(message: string = "Email already in use") {
        super(message);
        this.name = "DuplicateEmailError";
    }
}