# RideZora — Ride Booking Backend API

RideZora is a secure, scalable, role-based backend API for a ride-booking service. Built with **Express.js**, **TypeScript**, **Mongoose (MongoDB)** and **JWT**, this API supports three roles — **admin**, **rider**, and **driver** — and implements full ride lifecycle management, driver workflows, and admin controls.

---

# Table of Contents

* [Project overview](#project-overview)
* [Tech stack](#tech-stack)
* [Features](#features)
* [Setup & environment instructions](#setup--environment-instructions)

  * [Prerequisites](#prerequisites)
  * [Install](#install)
  * [Environment variables](#environment-variables)
  * [Run](#run)
* [Authentication & Authorization](#authentication--authorization)
* [API endpoints summary](#api-endpoints-summary)

  * [Auth / User](#auth--user)
  * [Rides (Rider)](#rides-rider)
  * [Drivers (Driver)](#drivers-driver)
  * [Admin (Admin only)](#admin-admin-only)
* [Error handling & responses](#error-handling--responses)
* [Data & modeling notes](#data--modeling-notes)

---

# Project overview

RideZora provides the backend for requesting, matching, tracking, and completing rides. Core business logic includes:

* JWT-based authentication and role-based route protection.
* Secure password hashing (bcrypt).
* Rider flows: request ride, cancel (within rules), view ride history.
* Driver flows: accept or reject rides, update ride status, set availability, view earnings.
* Admin flows: approve/suspend drivers, block/unblock users, view all users/drivers/rides.
  
---

# Tech stack

* Node.js + Express (TypeScript)
* MongoDB + Mongoose
* JWT (jsonwebtoken)
* bcrypt for password hashing
* Zod for request validation

---

# Features

* Role-based endpoints and strict access control
* Ride lifecycle: `requested → accepted → picked_up → in_transit → completed` (+ cancelled)
* Driver earnings aggregation per driver (via MongoDB aggregation)

---

# Setup & environment instructions

## Prerequisites

* Node.js >= 18
* npm 
* MongoDB (local or Atlas)

## Install

```bash
# clone
git clone https://github.com/AH-Ratul/ridezora_server
cd ridezora_server

# install dependencies
npm install
```

## Environment variables

Create a `.env` file in project root (use `.env.example` as reference). Minimum variables:

```
PORT=
DB_URL=
NODE_ENV=

#JWT
JWT_SECRET=
JWT_EXPIRES=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES=

#bcrypt SALT
SALT=

#Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```

> Keep secrets out of version control and rotate them in production.

## Run

```bash
# build & start (production)
npm run build
npm run start

# dev (ts-node / nodemon)
npm run dev
```

---

# Authentication & Authorization

* **Login** returns an `accessToken` (short lived) and `refreshToken` (long lived).
* Attach header on protected routes:

  ```
  Authorization: Bearer <accessToken>
  ```
* Use `refreshToken` endpoint to retrieve new access tokens.
* Middlewares:

  * `checkAuth(...roles)` — restricts route to given roles.

---

# API endpoints summary

> All endpoints are prefixed with `/api/v1`. Responses use standard HTTP status codes and a JSON body `{ success, message, data }` where applicable.

---

## Auth / User

### `POST /api/v1/user/register`

Register new user (rider or driver).

* **Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret",
  "role": "driver", // or "rider"
  "vehicleInfo": { "model": "...", "licensePlate":"...", "type":"Bike", "color":"..." } // optional for drivers
}
```

* **Notes**: Drivers will likely need admin approval (`isApproved`).

---

### `POST /api/v1/auth/login`

Login using email/password.

* **Body**

```json
{
  "email": "john@example.com",
  "password": "secret"
}
```

* **Response**

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "user": { "_id": "...", "email":"...", "role":"driver", ... }
}
```

---

## Rides (Rider)

### `POST /api/v1/rides/request`

Request a ride (Rider only).

* **Auth**: `Authorization: Bearer <accessToken>` (role: `rider`)
* **Body**

```json
{
  "pickup": "House 1, Dhanmondi",,
  "destination": "Gulshan 2, Dhaka",
}
```

* **Response**: created `ride` object with `status: requested`.

---

### `PATCH /api/v1/rides/cancel/:rideId`

Cancel a ride (Rider only).

* **Auth**: role `rider`
* **Rules**: Only allowed when ride is still `requested` (or as per your business rules). Cancelling after driver accepted may incur penalty.
* **Example**

```
PATCH /api/v1/rides/cancel/68921fb241ca182a2f2f0ad4
```

---

## Drivers (Driver)

### `GET /api/v1/drivers/available`

List available ride requests for the driver (Driver only).

* **Auth**: role `driver`
* Returns list of `requested` rides nearby.

---

### `PATCH /api/v1/drivers/accept/:rideId`

Driver accepts a ride.

* **Auth**: role `driver`

```
PATCH /api/v1/drivers/accept/689376a9c787f5bf2bb2d318
```

* **Rules**: Only available if ride `status === requested` and driver is approved & online. Updates `status: accepted`, sets `driver`, `acceptedAt`.

---

### `PATCH /api/v1/drivers/status/:rideId`

Driver updates ride status (`picked_up`, `in_transit`, `completed`).

* **Auth**: role `driver`

```
PATCH /api/v1/drivers/status/689376a9c787f5bf2bb2d318
Body: { "status": "IN_TRANSIT" } OR { "status": "COMPLETED" }
```

* **Notes**: Status transitions validated. Timestamps saved (`pickedUpAt`, `inTransit`, `completedAt`). History appended.

---

### `GET /api/v1/drivers/driver-earnings`

Driver earnings summary (Driver only).

* **Auth**: role `driver`
* **Response**: aggregated `totalEarnings`, `totalRides`, and `rides` with fields: `pickup`, `destination`, `fare`, `status`, `paymentStatus`.

---

## Admin (Admin only)

> All admin endpoints require `Authorization: Bearer <AccessToken>` and role `admin`.


### `PATCH /api/v1/admin/approved/:driverId`

Approve a driver:

```
PATCH /api/v1/admin/approved/6895cacbc125b1638745b5ab
```

* Sets `status: APPROVED`, optionally notifies driver.

---

### `PATCH /api/v1/admin/suspend/:driverId`

Suspend a driver:

```
PATCH /api/v1/admin/suspend/6895cacbc125b1638745b5ab
```

* Sets `status: SUSPENDED`, driver cannot accept rides.

---

### `PATCH /api/v1/admin/block/:userId`

Block a user (rider or driver):

```
PATCH /api/v1/admin/block/6895cacbc125b1638745b5ab
```

* Sets `isBlocked: true`. Blocked users cannot log in / request rides.

---

### `PATCH /api/v1/admin/unblock/:userId`

Unblock a user:

```
PATCH /api/v1/admin/unblock/6895cacbc125b1638745b5ab
```

* Sets `isBlocked: false`.

---

### `GET /api/v1/admin/all-users`

View all users (paginated):

```
GET /api/v1/admin/all-users
```

### `GET /api/v1/admin/all-drivers`

View all drivers:

```
GET /api/v1/admin/all-drivers
```

### `GET /api/v1/admin/all-rides`

View all rides (admin):

```
GET /api/v1/admin/all-rides
```

> Note: The sample paths you listed end with IDs — normally list endpoints are `GET /admin/all-users` etc. For single resource retrieval include `/:id` where appropriate (e.g. `GET /api/v1/admin/user/:id`).

---

# Error handling & responses

* Standard JSON error format:

```json
{
  "success": false,
  "message": "Not Found",
  "err": { /* details in development only */ }
}
```

* Use appropriate status codes:

  * `200` OK, `201` Created
  * `400` Bad Request
  * `401` Unauthorized
  * `403` Forbidden
  * `404` Not Found
  * `409` Conflict
  * `500` Internal Server Error

---

# Data & modeling notes

* **User** model: single model with `role` field + driver-specific fields (`isApproved`, `availability`, `vehicleInfo`).
* **Ride** model:

  * `rider`, `driver` references
  * `pickup` and `destination`
  * `status` enum
  * Timestamps for each significant event

---

