
# User Profile API Usage Guide

This guide provides details about the User Profile-related APIs, including their endpoints, request/response structures, and usage.

---

## Retrieve User Profile API

**Endpoint**: `GET /profile/`

**Description**: This API retrieves the authenticated user's profile information.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response**:
- **Success (200 OK)**:
```json
{
    "data": {
        "username": "john_doe",
        "bio": "This is my bio.",
        "profile_image": "https://example.com/media/profile_images/user1.jpg"
    },
    "meta": {
        "message": "User profile retrieved successfully.",
        "status": 200
    }
}
```

- **Error (400 Bad Request)**:
```json
{
    "data": {},
    "meta": {
        "message": "User profile not found.",
        "status": 400
    }
}
```

---

## Update User Profile API

**Endpoint**: `PUT /profile/`

**Description**: This API updates the authenticated user's profile information.

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
    "bio": "Updated bio.",
    "profile_image": "<binary_file>"
}
```

**Response**:
- **Success (200 OK)**:
```json
{
    "data": {
        "username": "john_doe",
        "bio": "Updated bio.",
        "profile_image": "https://example.com/media/profile_images/user1_updated.jpg"
    },
    "meta": {
        "message": "User profile updated successfully.",
        "status": 200
    }
}
```

- **Error (400 Bad Request)**:
```json
{
    "data": {},
    "meta": {
        "message": "Invalid input data.",
        "status": 400
    }
}
```

---

### Example Usage

**Retrieve Profile**:
```
GET /profile/ HTTP/1.1
Host: example.com
Authorization: Bearer <your_valid_token>
```

**Update Profile**:
```
PUT /profile/ HTTP/1.1
Host: example.com
Authorization: Bearer <your_valid_token>
Content-Type: application/json

{
    "bio": "Updated bio."
}
```
---

### Notes
- Ensure the `Authorization` header is included in all requests.
- The `PUT` request allows updating the `bio` and `profile_image` fields only.
- Email is excluded from being editable.
- Ensure that the profile image is uploaded in a valid image format (e.g., JPG, PNG).
