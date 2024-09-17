
# MyFlix Movie API

This is the server-side component of the **MyFlix Movie Application**. The API provides movie data, user management, and user authentication for the application. It's built using Node.js, Express, and MongoDB, with authentication handled by JSON Web Tokens (JWT).

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [License](#license)

## Features

- User authentication and authorization using JWT.
- API endpoints to retrieve information about movies, directors, genres, and actors.
- Users can register, log in, and update their profiles.
- Users can add or remove favorite movies from their lists.
- Role-based access control to ensure only authorized users can modify data.

## Technologies Used

- **Node.js**: JavaScript runtime environment for building the server-side application.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user and movie data.
- **Mongoose**: ODM library for MongoDB to interact with the database.
- **Passport.js**: Middleware for user authentication.
- **JWT (JSON Web Tokens)**: Used for user authentication and authorization.
- **JSDoc**: Used for generating documentation from comments within the code.

## Installation

To set up this API locally:

1. Clone this repository:

   \`\`\`bash
   git clone https://github.com/lawtronicus/myFlix-Angular-client.git
   \`\`\`

2. Navigate to the project directory:

   \`\`\`bash
   cd myFlix-Angular-client
   \`\`\`

3. Install the dependencies:

   \`\`\`bash
   npm install
   \`\`\`

4. Set up your environment variables by creating a `.env` file in the root directory and adding the following:

   \`\`\`bash
   JWT_SECRET=your_super_secret_key
   CONNECTION_URI=your_mongodb_connection_string
   \`\`\`

5. Start the server:

   \`\`\`bash
   npm start
   \`\`\`

   The API will be running at `http://localhost:8080`.

## Configuration

The project relies on the following environment variables:

- `JWT_SECRET`: Secret key used for JWT token generation.
- `CONNECTION_URI`: MongoDB connection string (e.g., MongoDB Atlas connection).

Make sure to configure these in the `.env` file.

## API Endpoints

Here are the available API endpoints. All protected routes require a valid JWT token.

### Movies

- **GET /movies**: Get a list of all movies.
- **GET /movies/:title**: Get details of a specific movie by title.
- **GET /movies/:title/directors**: Get the director of a specific movie.
- **GET /movies/:title/writers**: Get the writers of a specific movie.
- **GET /movies/:title/main_actor**: Get the main actor of a specific movie.
- **GET /movies/:title/description**: Get the description of a specific movie.
- **GET /movies/:title/image**: Get the image URL of a specific movie.
- **GET /movies/:title/genre**: Get the genre of a specific movie.

### Directors

- **GET /directors/:directorName**: Get details about a specific director by name.

### Genres

- **GET /genres/:genreName**: Get details about a specific genre by name.

### Users

- **GET /users**: Get a list of all users.
- **GET /users/:ID**: Get a specific user by ID.
- **POST /users**: Register a new user.
- **PUT /users/:id**: Update a user's details.
- **PUT /users/:userId/:movieTitle**: Add a movie to a user's favorites.
- **DELETE /users/:userId/:movieTitle**: Remove a movie from a user's favorites.
- **DELETE /users/:userId**: Delete a user by ID.

## Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. Upon successful login, the user receives a token that must be included in the `Authorization` header of all subsequent requests to protected routes.

Example:

\`\`\`bash
Authorization: Bearer <token>
\`\`\`

### Login

- **POST /login**: Authenticate a user and receive a JWT token.

  Request body:

  \`\`\`json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  \`\`\`

## Error Handling

The API returns the following HTTP status codes in its responses:

- `200 OK`: Successful requests.
- `201 Created`: Resource creation successful.
- `400 Bad Request`: The request was invalid or missing parameters.
- `401 Unauthorized`: Authentication required or failed.
- `403 Forbidden`: Access to the requested resource is forbidden.
- `404 Not Found`: The requested resource was not found.
- `500 Internal Server Error`: An error occurred on the server.

Errors are returned in JSON format:

\`\`\`json
{
  "message": "Error description"
}
\`\`\`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
