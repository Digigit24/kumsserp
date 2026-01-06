# WebSocket API Specification

**Version:** 1.0 (Local Development)
**Base URL:** `ws://127.0.0.1:8000/ws/v1/`

## Overview

KUMSS ERP uses WebSockets for real-time communication features, specifically for **Chats** and **Notifications**.

### Connectivity

- **Protocol:** `ws://` (Local) or `wss://` (Production)
- **Path Prefix:** `/ws/v1/`

### Authentication

WebSockets are authenticated via **URL Query Parameter**.
The user's Auth Token must be appended to the WebSocket URL.

**Format:**
`ws://127.0.0.1:8000/ws/v1/endpoint/?token=<AUTH_TOKEN>`

---

## 1. Chat WebSocket

**Endpoint:** `/ws/v1/chat/`

This endpoint handles all real-time messaging between users.

### Connection Lifecycle

1.  **Connect:** Client initiates connection with `?token=<AUTH_TOKEN>`.
2.  **Authenticate:** Server validates token. If invalid, connection closes (Code 4003).
3.  **Session:** Once connected, the user is online and can send/receive messages.
4.  **Disconnect:** Connection closed by user or server.

### Message Structure

All messages are JSON objects.

**Common Fields:**

- `type`: String, identifies the event type.

---

### Client-to-Server Events

#### 1. Send Message

Send a text message to a specific user.

```json
{
  "type": "chat_message",
  "message": "Hello, are you available?",
  "recipient_id": 5
}
```

- `message`: The content of the message.
- `recipient_id`: The ID of the user receiving the message.

#### 2. Mark as Read

Mark all messages from a specific sender as read.

```json
{
  "type": "mark_read",
  "sender_id": 5
}
```

#### 3. Typing Indicator

Notify a recipient that the user is typing.

```json
{
  "type": "typing",
  "recipient_id": 5
}
```

---

### Server-to-Client Events

#### 1. Receive Message

Incoming message from another user.

```json
{
  "type": "chat_message",
  "id": 1024,
  "sender_id": 5,
  "sender_name": "Aarav Sharma",
  "message": "Hello, are you available?",
  "timestamp": "2026-01-06T12:30:00Z"
}
```

#### 2. Message Read Status

Confirmation that sent messages have been read.

```json
{
  "type": "messages_read",
  "reader_id": 5,
  "timestamp": "2026-01-06T12:35:00Z"
}
```

#### 3. User Typing

Notification that another user is typing.

```json
{
  "type": "user_typing",
  "sender_id": 5
}
```

#### 4. Error

Sent when an operation fails.

```json
{
  "type": "error",
  "message": "User not found or offline."
}
```

---

## 2. Notification WebSocket

**Endpoint:** `/ws/v1/notifications/`

This endpoint pushes system-wide alerts and notifications (e.g., Leave Approved, PO Created).

### Server-to-Client Events

#### 1. New Notification

```json
{
  "type": "notification",
  "id": 501,
  "title": "Leave Approved",
  "message": "Your leave request for Jan 10th has been approved.",
  "category": "hr",
  "link": "/hr/leave-applications/12",
  "timestamp": "2026-01-06T14:00:00Z",
  "is_read": false
}
```

#### 2. Unread Count Update

Pushes the total count of unread notifications.

```json
{
  "type": "unread_count",
  "count": 3
}
```
