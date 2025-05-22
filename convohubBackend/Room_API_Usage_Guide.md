# Room API Usage Guide

This guide provides details about the Room-related APIs, including their endpoints, request/response structures, and usage.

---

## Create Room API

**Endpoint**: `POST /rooms/create/`

**Description**: This API creates a new room with the authenticated user as the host.

**Headers**:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
    "name": "string"
}
```

**Response**:
- **Success (201 Created)**:
```json
{
    "data": {
        "id": 1,
        "name": "Test Room",
        "host": {"id": 1, "username": "testuser"},
        "members": [{"id": 1, "username": "testuser"}],
        "created_at": "2024-11-19T12:34:56Z"
    },
    "meta": {
        "message": "Room created successfully",
        "status": 201
    }
}
```
- **Error (400 Bad Request)**:
```json
{
    "data": {},
    "meta": {
        "message": "Invalid input data",
        "status": 400
    }
}
```

---

## List Rooms API

**Endpoint**: `GET /rooms/`

**Description**: This API retrieves a list of all rooms.

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Response**:
- **Success (200 OK)**:
```json
{
    "data": [
        {
            "id": 1,
            "name": "Test Room",
            "host": {"id": 1, "username": "testuser"},
            "members": [{"id": 1, "username": "testuser"}],
            "created_at": "2024-11-19T12:34:56Z"
        }
    ],
    "meta": {
        "message": "Rooms fetched successfully",
        "status": 200
    }
}
```

---

## Retrieve Room Details API

**Endpoint**: `GET /rooms/<int:pk>/`

**Description**: Retrieves the details of a specific room by its ID, including recent messages in the room.

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Response**:
- **Success (200 OK)**:
```json
{
    "data": {
        "room": {
            "id": 1,
            "name": "Test Room",
            "host": {"id": 1, "username": "testuser"},
            "members": [{"id": 1, "username": "testuser"}],
            "created_at": "2024-11-19T12:34:56Z"
        },
        "messages": [
            {
                "id": 101,
                "user": "john_doe",
                "content": "Welcome to the room!",
                "created_at": "2024-11-20T10:15:00Z"
            },
            {
                "id": 102,
                "user": "jane_doe",
                "content": "Hello, everyone!",
                "created_at": "2024-11-20T10:16:00Z"
            }
        ]
    },
    "meta": {
        "message": "Room details and messages fetched successfully",
        "status": 200
    }
}
```

- **Error (404 Not Found)**:
```json
{
    "data": {},
    "meta": {
        "message": "Room not found",
        "status": 404
    }
}
```

---

## Recent Activities API

**Endpoint**: `GET /rooms/recent/`

**Description**: Retrieves the most recent activities (messages) in the system, including the room and user details.

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `limit` (optional): The maximum number of recent activities to fetch. Default is 50.

**Response**:
- **Success (200 OK)**:
```json
{
    "data": [
        {
            "message_id": 101,
            "content": "Welcome to the room!",
            "room": {
                "room_id": 1,
                "room_name": "General Chat"
            },
            "user": {
                "user_id": 1,
                "username": "john_doe"
            },
            "created_at": "2024-11-20T10:15:00Z"
        },
        {
            "message_id": 102,
            "content": "Hello, everyone!",
            "room": {
                "room_id": 2,
                "room_name": "Support Room"
            },
            "user": {
                "user_id": 2,
                "username": "jane_doe"
            },
            "created_at": "2024-11-20T10:16:00Z"
        }
    ],
    "meta": {
        "message": "2 recent activities found.",
        "status": 200
    }
}
```

- **No Activities Found (200 OK)**:
```json
{
    "data": {},
    "meta": {
        "message": "No recent activities found.",
        "status": 200
    }
}
```

- **Invalid Limit (400 Bad Request)**:
```json
{
    "data": {},
    "meta": {
        "message": "Limit parameter must be greater than 0.",
        "status": 400
    }
}
```
---
## Search Room API

**Endpoint**: `GET /rooms/search/`

**Description**: This API searches for rooms by their name or topic based on the provided query parameter.

**Headers**:
```http
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `query` (required): The search term to filter rooms by name or topic.

**Response**:
- **Success (200 OK)**:
```json
{
    "data": [
        {
            "room_id": 1,
            "room_name": "General Discussion",
            "topic": "Technology",
            "description": "A room for general tech discussions.",
            "host": "admin",
            "members_count": 10,
            "created_at": "2024-11-19T12:34:56Z"
        }
    ],
    "message": "1 room(s) found.",
    "status": 200
}
```

- **No Rooms Found (200 OK)**:
```json
{
    "data": {},
    "message": "No rooms found matching the query.",
    "status": 200
}
```

- **Error (400 Bad Request)**:
```json
{
    "data": {},
    "message": "Query parameter is required.",
    "status": 400
}
```
---

## Notes
- Ensure the `Authorization` header is included in all requests.
- For the **Retrieve Room Details API**, the `messages` key includes the recent messages in the room.
- The **Recent Activities API** returns a global list of recent messages, showing activity across all rooms.