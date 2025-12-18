# Error Tracking System

## Overview
The application now includes comprehensive error tracking that displays detailed error information in alerts, making it easy to copy and share error details for debugging.

## How It Works

### Automatic Error Tracking
- All AJAX requests made through `authAxios()` automatically capture and display detailed error information
- Errors are shown in a user-friendly format first, then detailed technical information is available for copying

### Error Display Flow

1. **User-Friendly Message**: First, a simple alert shows the main error message
2. **Detailed Error Dialog**: A confirmation dialog asks if you want to see full error details
3. **Copyable Error Details**: If confirmed, a detailed error alert is shown with:
   - Timestamp
   - Request details (URL, method, data)
   - Response details (status, headers, data)
   - Error message
   - Stack trace
   - Full error object (JSON)

### Error Information Included

The error details include:
- **Context**: Where the error occurred (e.g., "Login", "Registration", "POST /api/cameras")
- **Timestamp**: When the error occurred
- **Request Information**: 
  - URL
  - HTTP Method
  - Request data
- **Response Information**:
  - HTTP Status code
  - Response data
  - Response headers
- **Error Details**:
  - Error message
  - Stack trace
  - Full error object

## Usage

### Automatic (Recommended)
Errors are automatically tracked when using:
- `authAxios()` - All authenticated requests
- `showErrorAlert(error, context)` - Manual error display

### Manual Error Display
If you need to manually show an error:

```javascript
try {
  // Your code
} catch (error) {
  showErrorAlert(error, 'Your Context Name');
}
```

## Copying Error Details

1. When an error occurs, you'll see a user-friendly message first
2. A confirmation dialog will ask if you want to see detailed error information
3. Click "OK" to view the full error details
4. The error details will be displayed in an alert - you can select and copy all the text
5. The error details are also logged to the browser console

## Example Error Output

```
=== Login ===
Time: 2025-12-17T10:30:45.123Z

--- Request ---
URL: http://127.0.0.1:8000/api/login
Method: POST
Data: {
  "username": "testuser",
  "password": "password123"
}

--- Response ---
Status: 401 Unauthorized
URL: http://127.0.0.1:8000/api/login

Response Data:
{
  "message": "Invalid credentials"
}

--- Error Message ---
Request failed with status code 401

--- Stack Trace ---
Error: Request failed with status code 401
    at createError (axios.js:1234)
    ...
```

## Files Updated

- `frontend/js/auth.js` - Added `formatErrorForAlert()` and `showErrorAlert()` functions
- `frontend/js/main.js` - Updated to use error handler
- `frontend/js/login.js` - Updated to use error handler
- `frontend/js/forgot.js` - Updated to use error handler
- All files using `authAxios()` automatically get error tracking

## Notes

- Errors are also logged to the browser console for developer tools
- The error handler automatically handles 401 (Unauthorized) errors by redirecting to login
- All other errors are displayed with full details for debugging

