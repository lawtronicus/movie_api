const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

/**
 * User schema for MongoDB.
 * Stores user information such as username, password, email, date of birth, and favorite movies.
 */
let userSchema = mongoose.Schema({
  username: { type: String, required: false }, // Username is optional
  password: { type: String, required: true }, // Password is required
  email: { type: String, required: true }, // Email is required
  dob: Date, // Date of birth is optional
  favorite_movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }], // References to favorite movies (Movie IDs)
});

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The user's password.
 * @returns {string} - The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  console.log("hashing password: ", password);
  return bcrypt.hashSync(password, 10); // Hashes password with salt rounds set to 10
};

/**
 * Validates a password by comparing it with the hashed password stored in the database.
 * @param {string} password - The user's password.
 * @returns {boolean} - True if the password is valid, false otherwise.
 */
userSchema.methods.validatePassword = function (password) {
  console.log("hashing password: ", password);
  return bcrypt.compareSync(password, this.password);
};

/**
 * Genre schema for MongoDB.
 * Stores genre information such as name and description.
 */
let genreSchema = mongoose.Schema({
  name: String, // Name of the genre
  description: String, // Description of the genre
});

/**
 * Director schema for MongoDB.
 * Stores director information such as name, bio, date of birth, and date of death.
 */
let directorSchema = mongoose.Schema({
  name: String, // Name of the director
  bio: String, // Biography of the director
  dob: String, // Date of birth of the director
  dod: String, // Date of death of the director (optional)
});

/**
 * Actor schema for MongoDB.
 * Stores actor information such as name, date of birth, and biography.
 */
let actorSchema = mongoose.Schema({
  name: String, // Name of the actor
  dob: Date, // Date of birth of the actor
  bio: String, // Biography of the actor
});

/**
 * Movie schema for MongoDB.
 * Stores movie information such as title, description, genres, directors, main actor, writers, image URL, and whether it's featured.
 */
let movieSchema = mongoose.Schema({
  title: { type: String, required: true }, // Title of the movie (required)
  description: { type: String, required: true }, // Description of the movie (required)
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }], // References to genres (Genre IDs)
  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director" }], // References to directors (Director IDs)
  main_actor: { type: mongoose.Schema.Types.ObjectId, ref: "Actor" }, // Reference to the main actor (Actor ID)
  writers: [String], // List of writer names
  imageurl: String, // URL to the movie's image/poster
  Featured: Boolean, // Indicates whether the movie is featured
});

// Create models from schemas
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Genre = mongoose.model("Genre", genreSchema);
let Director = mongoose.model("Director", directorSchema);
let Actor = mongoose.model("Actor", actorSchema);

// Export the models
module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.Actor = Actor;
