# YouTube Backend

A backend API for a YouTube-like video platform built with **Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary, and Multer**.

This project is focused on learning and implementing real-world backend concepts such as authentication, authorization, file uploads, Cloudinary integration, MongoDB relationships, aggregation pipelines, pagination, comments, watch history, and video management.

##  Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt**
* **Cloudinary**
* **Multer**
* **Cookie Parser**
* **CORS**
* **mongoose-aggregate-paginate-v2**
* **dotenv**

##  Features

### Authentication & Authorization

* User registration
* User login
* User logout
* JWT access tokens
* JWT refresh tokens
* HTTP-only cookies
* Password hashing with bcrypt
* Protected routes using JWT middleware
* Refresh token management

### User Management

* Get current user
* Update user details
* Update password
* Upload avatar
* Update avatar
* Upload cover image
* Update cover image
* Delete old Cloudinary assets when replacing images

Cloudinary assets are stored using both:

```js
{
    url,
    publicId
}
```

This makes it possible to both use the asset and delete/replace it later.

### Video Management

* Upload videos
* Upload video thumbnails
* Store videos on Cloudinary
* Store thumbnails on Cloudinary
* Store Cloudinary `url` and `publicId`
* Store video duration
* Track video views
* Publish/unpublish videos
* Associate videos with their owners

Video uploads use Multer for handling local files before uploading them to Cloudinary.

### Comments

* Add comments to videos
* Associate comments with users
* Associate comments with videos
* Update comments
* Delete comments
* Fetch comments for a video
* Pagination for comments

### Watch History

* Store videos watched by users
* Retrieve user watch history
* Use MongoDB aggregation and `$lookup`
* Populate video information
* Populate video owner information

### MongoDB Aggregation

The project uses MongoDB aggregation pipelines for operations such as:

* User channel profiles
* Subscriber counts
* Channels subscribed to
* Watch history
* Video/user relationships
* Checking subscription status

### Pagination

`mongoose-aggregate-paginate-v2` is used for pagination of aggregation results.

## 📁 Project Structure

```text
youtube-backend/
│
├── src/
│   ├── controllers/
│   │
│   ├── db/
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   └── comment.model.js
│   │
│   ├── routes/
│   │
│   ├── utils/
│   │   ├── apiError.js
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   │
│   ├── app.js
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

##  Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Never commit your `.env` file to GitHub.

##  Installation

Clone the repository:

```bash
git clone https://github.com/absar22/youtube-backend.git
```

Move into the project:

```bash
cd youtube-backend
```

Install dependencies:

```bash
npm install
```

Create your `.env` file and add the required environment variables.

Start the development server:

```bash
npm run dev
```

##  Video Upload

Videos and thumbnails are uploaded using `multipart/form-data`.

Example request body:

```text
title       → My First Video
description → This is my first video
videoFile   → video.mp4
thumbnail   → thumbnail.jpg
```

The backend:

```text
Client
   ↓
Multer
   ↓
Temporary local file
   ↓
Cloudinary
   ↓
Video URL + Public ID
   ↓
MongoDB
```

Cloudinary uses:

```js
resource_type: "auto"
```

for uploads, allowing the same upload utility to handle both images and videos.

##  Cloudinary

Uploaded assets are stored using:

```js
{
    url: "https://...",
    publicId: "..."
}
```

For example:

```js
videoFile: {
    url: videoFile.secure_url,
    publicId: videoFile.public_id
}
```

The `publicId` is kept so that an asset can later be deleted or replaced.

##  Testing with Postman

For endpoints that upload files, use:

```text
Body → form-data
```

For publishing a video:

| Key           | Type |
| ------------- | ---- |
| `title`       | Text |
| `description` | Text |
| `videoFile`   | File |
| `thumbnail`   | File |

Authentication-protected routes require the appropriate JWT cookie.

##  API Structure

The API uses versioned routes:

```text
/api/v1
```

Example:

```text
/api/v1/users
/api/v1/videos
/api/v1/comments
```

##  What I Am Learning From This Project

This project is being built to understand backend development beyond basic CRUD.

Key concepts practiced:

* REST API design
* MVC architecture
* Middleware
* Authentication
* Authorization
* JWT
* HTTP-only cookies
* Password hashing
* MongoDB relationships
* Mongoose schemas
* Mongoose methods
* MongoDB aggregation
* `$lookup`
* Pagination
* File uploads
* Multer
* Cloudinary
* Error handling
* Async error handling
* API response formatting
* Resource ownership
* CRUD operations

##  Work in Progress

The project is actively being developed. Planned/ongoing features include:

* Complete video management
* Complete comment management
* Likes
* Subscriptions
* Playlists
* Advanced video queries
* More aggregation pipelines
* Search and filtering
* Pagination across resources

## Goal

The goal of this project is to build a production-style backend while strengthening practical knowledge of **Node.js, Express, MongoDB, Mongoose, authentication, file handling, cloud storage, and backend architecture**.

This is not intended to be a complete clone of YouTube. It is a backend project for learning and implementing the core systems behind a video-sharing platform.

##  License

This project is licensed under the **MIT License**.

---

**Built by Absar Ahmad**




