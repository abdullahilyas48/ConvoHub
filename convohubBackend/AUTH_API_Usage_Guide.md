This document outlines how to use the `login` and `signup` APIs for authentication.

---

## **1. Signup API**

### **Endpoint**
```
POST /auth/signup/
```

### **Description**
This endpoint allows users to register for an account.

### **Request Payload**
| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| `username`| String | Yes      | Unique username for the user             |
| `email`   | String | Yes      | User's email address (only NUCES emails) |
| `password`| String | Yes      | Password for the user                    |

#### Example Request Body
```json
{
  "username": "exampleuser",
  "email": "example@lhr.nu.edu.pk",
  "password": "securepassword"
}
```

### **Response**
| Field      | Type   | Description                                           |
|------------|--------|-------------------------------------------------------|
| `message`  | String | Response message indicating success or failure         |
| `status`   | Number | HTTP status code                                       |
| `success`  | Boolean| Whether the operation was successful                   |
| `data`     | Object | Contains user-related data (e.g., token, username)     |

#### Example Success Response
```json
{
  "data": {
    "access_token": "jwt_token_here",
    "username": "exampleuser"
  },
  "meta": {
    "message": "Successfully Registered!",
    "status": 201
  }
}
```

#### Example Failure Response
```json
{
  "data": {},
  "meta": {
    "message": "Email already exists!",
    "status": 400
  }
}
```

---

## **2. Login API**

### **Endpoint**
```
POST /auth/login/
```

### **Description**
This endpoint allows registered users to log in and obtain an access token.

### **Request Payload**
| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| `username`| String | Yes      | User's registered username|
| `password`| String | Yes      | User's account password   |

#### Example Request Body
```json
{
  "username": "exampleuser",
  "password": "securepassword"
}
```

### **Response**
| Field      | Type   | Description                                           |
|------------|--------|-------------------------------------------------------|
| `message`  | String | Response message indicating success or failure         |
| `status`   | Number | HTTP status code                                       |
| `success`  | Boolean| Whether the operation was successful                   |
| `data`     | Object | Contains user-related data (e.g., token, username)     |

#### Example Success Response
```json
{
  "data": {
    "access_token": "jwt_token_here",
    "username": "exampleuser"
  },
  "meta": {
    "message": "success",
    "status": 200
  }
}
```

#### Example Failure Response
```json
{
  "data": {},
  "meta": {
    "message": "Incorrect password",
    "status": 400
  }
}
```

---

## **Common Notes**
1. **Authentication Token**:
   - After successful login or signup, you will receive an `access_token`. This token should be used for subsequent API calls that require authentication.

2. **Validation**:
   - Ensure the `email` follows the format `username@lhr.nu.edu.pk` for the signup API.
   - Passwords should be strong and kept secure.

3. **HTTP Status Codes**:
   - `201`: Resource created successfully (e.g., signup).
   - `200`: Request was successful (e.g., login).
   - `400`: Bad request due to validation errors or missing fields.

---

## **Error Handling**
Common reasons for failure:
1. **Invalid Credentials**:
   - Login fails if the username or password is incorrect.
2. **Duplicate Entries**:
   - Signup fails if the username or email is already registered.
3. **Validation Errors**:
   - Ensure all required fields are provided and formatted correctly.

---

## **3. Logout API**

### **Endpoint**
```
POST /auth/logout/
```

### **Description**
This endpoint allows authenticated users to log out by blacklisting all their refresh tokens.

### **Request Headers**
| Header         | Value           | Required | Description                        |
|----------------|-----------------|----------|------------------------------------|
| `Authorization`| Bearer <token>  | Yes      | Access token of the logged-in user|

### **Response**
| Field      | Type   | Description                                           |
|------------|--------|-------------------------------------------------------|
| `message`  | String | Response message indicating success or failure         |
| `status`   | Number | HTTP status code                                       |
| `success`  | Boolean| Whether the operation was successful                   |
| `data`     | Object | Additional data (empty in this case)                   |

#### Example Success Response
```json
{
  "data": {},
  "meta": {
    "message": "Successfully logged out.",
    "status": 200
  }
}
```

#### Example Failure Response
```json
{
  "data": {},
  "meta": {
    "message": "No refresh tokens found for the user.",
    "status": 400
  }
}
```

---

### **Common Notes for Logout**
1. **Access Required**:
   - The user must be authenticated to log out.
   - The provided access token must still be valid.

2. **Token Blacklisting**:
   - All outstanding refresh tokens for the user are blacklisted.

3. **HTTP Status Codes**:
   - `200`: Logout successful, tokens blacklisted.
   - `400`: Bad request, e.g., no tokens found for the user.
---
