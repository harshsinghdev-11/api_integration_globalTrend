# Post Manager - JSON Placeholder API Dashboard

A full-stack web application for managing and interacting with JSON Placeholder API posts. This application provides a user-friendly interface to fetch, create, update, filter, and save posts with user authentication and data persistence.

## 🌐 Live Demo

The application is deployed and available at:
**https://api-integration-globaltrend.onrender.com/**

You can access the live application directly without any local setup.

## Features

- 🔐 User authentication (Register, Login, Logout)
- 📊 Fetch posts from JSON Placeholder API (single post, all posts, posts by user)
- ✏️ Create and update posts
- 🔍 Advanced filtering capabilities (keyword search, user ID, body length)
- 💾 Save posts to user's personal collection
- 📱 Responsive design with modern UI
- ⚡ Client-side caching for improved performance

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Frontend**: EJS templating, Vanilla JavaScript
- **Styling**: Custom CSS with modern design principles

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm 

## Setup and Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd global_trend_assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
JWT_SECRET=your-secret-key-here
MONGO_URI=mongodb://localhost:27017/post-manager
```

**Environment Variables:**
- `PORT`: Server port number (default: 3000)
- `JWT_SECRET`: Secret key for JWT token signing (use a strong, random string)
- `MONGO_URI`: MongoDB connection string (local or cloud)

**Example for MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/post-manager?retryWrites=true&w=majority
```

### 4. Start MongoDB

If using local MongoDB, ensure MongoDB service is running:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 5. Run the Application

```bash
# Development mode (with nodemon for auto-restart)
node index.js
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

**Or access the live deployed version:**
```
https://api-integration-globaltrend.onrender.com/
```

## API Endpoints

### Authentication Endpoints

#### Register
- **GET** `/api/auth/register` - Render registration page
- **POST** `/api/auth/register` - Create a new user account
  - Body: `{ username: string, password: string }`
  - Redirects to login page on success

#### Login
- **GET** `/api/auth/login` - Render login page
- **POST** `/api/auth/login` - Authenticate user
  - Body: `{ username: string, password: string }`
  - Sets HTTP-only cookie with JWT token
  - Redirects to dashboard on success

#### Check Login Status
- **GET** `/api/auth/isLogin` - Check if user is authenticated
  - **Protected**: Requires valid JWT token
  - Returns: `{ username: string, id: string }`

#### Logout
- **GET** `/api/auth/logout` - Logout user
  - **Protected**: Requires valid JWT token
  - Clears authentication cookie

### JSON Placeholder API Endpoints

All endpoints interact with the JSON Placeholder API and implement client-side caching.

#### Get Single Post
- **GET** `/api/jsonPlaceHolder/post/:id`
  - Fetches a single post by ID
  - Returns cached data if available
  - Response: `{ success: boolean, cached: boolean, data: object }`

#### Get All Posts
- **GET** `/api/jsonPlaceHolder/posts`
  - Fetches all 100 posts from JSON Placeholder
  - Returns cached data if available
  - Response: `{ success: boolean, cached: boolean, count: number, data: array }`

#### Create Post
- **POST** `/api/jsonPlaceHolder/post`
  - Creates a new post on JSON Placeholder API
  - Body: `{ title: string, body: string, userId: number }`
  - Response: `{ success: boolean, created: object }`

#### Update Post
- **PUT** `/api/jsonPlaceHolder/post/:id`
  - Updates an existing post
  - Body: `{ title: string, body: string, userId: number }`
  - Updates cache for the specific post
  - Response: `{ success: boolean, updated: object }`

#### Get Posts by User ID
- **GET** `/api/jsonPlaceHolder/posts/user/:userId`
  - Fetches all posts for a specific user
  - Returns cached data if available
  - Response: `{ success: boolean, cached: boolean, count: number, data: array }`

### User Posts Endpoints

All endpoints require authentication (JWT token in cookie).

#### View Saved Posts Page
- **GET** `/api/posts` - Render user's saved posts page

#### Get All Saved Posts
- **GET** `/api/getPosts` - Get all posts saved by the authenticated user
  - **Protected**: Requires authentication
  - Response: `{ posts: array }`

#### Save Multiple Posts
- **POST** `/api/add-multiple` - Save multiple posts to user's collection
  - **Protected**: Requires authentication
  - Body: `{ posts: array }` where each post has `{ title, body, Idjson, userId }`
  - Response: `{ message: string, count: number }`

#### Delete All Saved Posts
- **GET** `/api/deleteAllPosts` - Delete all posts from user's collection
  - **Protected**: Requires authentication
  - Response: `{ message: string }`

### Other Endpoints

#### Health Check
- **GET** `/check` - Server health check
  - Response: `"Server is running"`

#### Dashboard
- **GET** `/` - Render main dashboard page

## Filters Implemented

The application provides client-side filtering capabilities for cached posts. Filters can be combined and work on posts that have been fetched and cached in the browser.

### Available Filters

1. **Keyword Search**
   - Searches in both `title` and `body` fields
   - Case-insensitive matching
   - Partial string matching

2. **User ID Filter**
   - Filters posts by specific user ID
   - Exact match filtering

3. **Minimum Body Length**
   - Filters posts with body length greater than or equal to the specified value
   - Numeric input

4. **Maximum Body Length**
   - Filters posts with body length less than or equal to the specified value
   - Numeric input

### Filter Behavior

- Filters are applied to the cached posts array in the browser
- Multiple filters can be applied simultaneously (AND logic)
- Empty filter fields are ignored
- Filter results are displayed in a table format
- "Clear Filter" button resets all filters and displays all cached posts

### Usage

1. First, fetch posts using "Fetch 100 Posts" or "Get User Posts"
2. Posts are cached in the browser
3. Use the filter section to apply filters
4. Click "Apply Filter" to see filtered results
5. Click "Clear Filter" to reset and show all cached posts

## Project Structure

```
global_trend_assignment/
├── controllers/          # Business logic controllers
│   ├── authController.js
│   ├── jsonPlaceholderController.js
│   └── posts.controller.js
├── db/                   # Database configuration
│   └── db.js
├── middleware/           # Express middleware
│   └── authMiddleware.js
├── model/                # Mongoose models
│   └── User.js
├── public/               # Static files
│   ├── css/
│   │   ├── index.css
│   │   └── posts.css
│   └── js/
│       ├── index.js
│       └── posts.js
├── routes/               # Route definitions
│   ├── auth.js
│   ├── jsonPlaceholderRoutes.js
│   └── userPost.js
├── views/                # EJS templates
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── posts.ejs
├── .env                  # Environment variables (create this)
├── index.js              # Main server file
└── package.json
```

## Assumptions and Notes

### Assumptions

1. **Caching Strategy**
   - Client-side caching is implemented for fetched posts
   - Cache persists during the browser session
   - Cache is cleared when the page is refreshed
   - Single post cache is updated when a post is modified

2. **Authentication**
   - JWT tokens are stored in HTTP-only cookies for security
   - Token expiration is set to 1 hour
   - Users must be authenticated to save/delete posts
   - Session persists across page refreshes via cookies

3. **Data Mapping**
   - When saving posts, the `id` field from JSON Placeholder is mapped to `Idjson` in the database
   - This allows distinguishing between MongoDB's `_id` and the original JSON Placeholder post ID

4. **Error Handling**
   - API errors are handled gracefully with user-friendly messages
   - 401 errors redirect to login page
   - Network errors display appropriate error messages

5. **User Experience**
   - Forms validate required fields on the client side
   - Loading states are shown during API calls
   - Success/error messages are displayed with auto-dismiss after 5 seconds
   - Smooth scrolling to results after operations

### Notes

1. **JSON Placeholder API**
   - This is a fake REST API for testing and prototyping
   - Created/updated posts are not actually persisted on JSON Placeholder
   - The API returns mock data with IDs 1-100

2. **Database Schema**
   - User model includes an array of posts
   - Each post contains: `title`, `body`, `Idjson`, `userId`
   - Posts are stored as subdocuments in the User collection

3. **Security Considerations**
   - Passwords are hashed using bcrypt (10 salt rounds)
   - JWT tokens are signed with a secret key
   - HTTP-only cookies prevent XSS attacks
   - CORS is configured for localhost:3000

4. **Performance**
   - Client-side caching reduces API calls
   - Cache is checked before making API requests
   - Filtering is done client-side for instant results

5. **Browser Compatibility**
   - Modern browsers with ES6+ support
   - Uses Fetch API for HTTP requests
   - Responsive design works on mobile and desktop

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGO_URI` in `.env` file
   - Verify network connectivity for cloud MongoDB

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Or stop the process using the port

3. **Authentication Not Working**
   - Check `JWT_SECRET` is set in `.env`
   - Clear browser cookies and try again
   - Ensure cookies are enabled in browser

4. **Posts Not Saving**
   - Verify user is logged in
   - Check browser console for errors
   - Ensure MongoDB connection is active



