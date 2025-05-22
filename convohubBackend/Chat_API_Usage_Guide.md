
# Live Chat API Usage Guide

This guide explains how to use the live chat functionality for the app, including WebSocket connections, room-based messaging, and authentication.

---

## WebSocket Connection

### Endpoint
```plaintext
ws://<backend-domain>/ws/chat/<room_id>/?token=<JWT_TOKEN>
```

### Authentication
- **JWT Token**: The WebSocket connection requires a valid JWT token as a query parameter for authentication.

### Headers
No additional headers are required for the WebSocket connection.

---

## Sending Messages

### Format
Messages must be sent as a JSON object in the following format:

```json
{
    "message": "Your message here"
}
```

### Example (Frontend JavaScript)
```javascript
const socket = new WebSocket('ws://localhost:8000/ws/chat/1/?token=your-jwt-token');

socket.onopen = () => {
    console.log("Connected to WebSocket");
    socket.send(JSON.stringify({
        message: "Hello, everyone!"
    }));
};

socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log("Received:", data);
};

socket.onclose = () => {
    console.log("WebSocket connection closed");
};
```

---

## Receiving Messages

### Format
Messages received from the server will be in the following format:

```json
{
    "message": "Your message here",
    "user_id": 1
}
```

### Example Response
```json
{
    "message": "Hello, world!",
    "user_id": 2
}
```

---

## Disconnecting

### WebSocket Closure
The WebSocket connection can be closed manually or will be closed by the server in the following cases:
- Invalid or missing JWT token.
- Server shutdown or errors.

---

## Notes
- Ensure that the JWT token is valid and not expired.
- Replace `<backend-domain>` with your backend server’s domain or IP.
- Replace `<room_id>` with the unique ID of the room for the chat.
- This guide assumes the backend is running on `localhost:8000` during development.

---

For further queries or issues, please contact the backend team.
