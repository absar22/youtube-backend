# Creating youtube backend
## I'm building this to learn how production-style Node/Express backends work.

## Teck Stack and Npm Packages I'm using for this project

- Node.js — JavaScript runtime
- Express.js — Backend framework for building REST APIs
- MongoDB — Database
- Mongoose — ODM for MongoDB
- JWT (jsonwebtoken) — Authentication using access and refresh tokens
- bcrypt — Password hashing
- Cloudinary — Image/video file storage
- Multer — Handling file uploads
- Cookie Parser — Reading authentication cookies such as access tokens and refresh tokens
- CORS — Handling cross-origin requests
- dotenv — Managing environment variables
- mongoose-aggregate-paginate-v2 — Pagination for MongoDB aggregation pipelines
- Nodemon — Automatically restarting the server during development
- Prettier — Code formatting


## Features

### Authentication & Authorization

* User registration with username, email, fullname, password, and avatar
* User login using username or email
* JWT-based authentication
* Access token and refresh token generation
* Refresh token rotation
* Secure authentication cookies
* User logout
* Protected routes using authentication middleware

### User Account Management

* Get current logged-in user
* Change current password
* Update account details such as fullname and email
* Password hashing using bcrypt

### File Uploads

* Avatar upload
* Cover image upload
* Image upload handling using Multer
* Cloudinary integration for storing uploaded images
* Update existing avatar
* Update existing cover image

### Channel / Profile

* Fetch channel profile using username
* Display channel avatar and cover image
* Calculate subscriber count
* Calculate number of subscribed channels
* Check whether the current user is subscribed to a channel
* MongoDB aggregation pipeline for channel profile data

### Database

* MongoDB integration using Mongoose
* User model and schema
* MongoDB aggregation pipelines
* Aggregation-based subscriber information
* Pagination support using `mongoose-aggregate-paginate-v2`

### API & Backend

* REST API architecture
* Express.js middleware
* Centralized async error handling
* Custom API error responses
* Custom API response structure
* Environment variable configuration using dotenv
* CORS configuration
* Cookie-based authentication
