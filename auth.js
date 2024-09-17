const Models = require("./models.js");

/**
 * Load environment variables from a .env file into process.env
 * This is necessary to access environment-specific variables like JWT_SECRET.
 * Using 'dotenv' allows you to securely manage these variables outside of the source code.
 */
require("dotenv").config();

const Users = Models.User;

// Use environment variable for JWT secret, with a fallback for development purposes
const jwtSecret = process.env.JWT_SECRET || "default_secret_key";

const jwt = require("jsonwebtoken");
const passport = require("passport");
require("./passport");

/**
 * Generates a JWT token for a user.
 * @param {object} user - The user object for whom the token is generated.
 * @returns {string} - The generated JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: String(user._id), // The user ID is used as the token subject
    expiresIn: "7d", // Token expiration time
    algorithm: "HS256", // Algorithm used to sign the token
  });
};

/**
 * POST login: Authenticates a user and returns a JWT token.
 * @param {object} router - Express router object.
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something went wrong",
          user: user,
        });
      }

      // Fetch and log populated user data for debugging
      Users.findById(user._id)
        .populate({
          path: "favorite_movies",
        })
        .then((populatedUser) => {
          req.login(user, { session: false }, (error) => {
            if (error) {
              res.send(error);
            }
            let token = generateJWTToken(user.toJSON());
            return res.json({ user: populatedUser, token });
          });
        })
        .catch((err) => {
          console.error("Error populating user:", err);
          return res.status(500).json({ error: "Error populating user" });
        });
    })(req, res);
  });
};
