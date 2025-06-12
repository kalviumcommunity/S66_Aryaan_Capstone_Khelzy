# Authentication Middleware

This folder contains middleware functions for the Khelzy Games application.

## authMiddleware.js

The `authMiddleware.js` file provides JWT token verification functionality:

### verifyToken

`verifyToken` is a middleware function that:

1. Checks for JWT token in cookies first, then in the Authorization header
2. Verifies the token's validity
3. Finds the user associated with the token
4. Attaches the user object to the request for use in protected routes

#### Usage

```javascript
const { verifyToken } = require('../MiddleWare/authMiddleware');

// Example of protecting a route
router.post('/protected-route', verifyToken, yourControllerFunction);
```

#### Authentication Flow

1. **Login**: When a user logs in successfully, a JWT token is generated and:
   - Stored in an HTTP-only cookie
   - Also returned in the response body for client-side storage if needed

2. **Protected Routes**: When accessing protected routes, the middleware:
   - First checks for a token in the cookies
   - Falls back to checking the Authorization header if no cookie is found
   - Verifies the token and attaches the user to the request

3. **Logout**: When a user logs out, the token cookie is cleared

#### Client Implementation

For clients using cookies (automatic with browsers):
- The cookie will be automatically sent with each request
- Set `credentials: 'include'` in fetch requests
- No need to manually include the token

For clients using Authorization header:
```javascript
// Example fetch request with token
fetch('http://localhost:8080/games/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // token received during login
  },
  body: JSON.stringify(gameData)
})
```

#### Error Responses

The middleware returns appropriate error responses:

- 401 - No token provided, invalid token, or expired token
- 404 - User not found
- 500 - Internal server error 