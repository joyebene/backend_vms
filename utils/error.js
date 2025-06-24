class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TokenError';
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export { AuthError, TokenError, DatabaseError };