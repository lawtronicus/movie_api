const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * LocalStrategy for authenticating users based on email and password.
 *
 * This strategy is used for the login endpoint and checks if the email and password
 * match an existing user in the database.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Define the field to be used as the username
      passwordField: "password", // Define the field to be used as the password
    },
    /**
     * Authenticate user by email and password.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @param {function} callback - The callback to pass the result of authentication.
     * @returns {function} - Returns the user object if authentication is successful, or false if unsuccessful.
     */
    async (email, password, callback) => {
      console.log(`${email} ${password}`);
      await Users.findOne({ email: email })
        .then((user) => {
          if (!user) {
            console.log("incorrect email");
            return callback(null, false, {
              message: "Incorrect email or password.",
            });
          }
          // Validate the password using the method from the user model
          if (!user.validatePassword(password)) {
            console.log("incorrect password");
            return callback(null, false, { message: "Incorrect password." });
          }
          console.log("finished");
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        });
    },
  ),
);

/**
 * JWTStrategy for authenticating users based on JWT tokens.
 *
 * This strategy extracts the JWT from the Authorization header and verifies the token
 * using the secret key. If valid, it returns the user associated with the token.
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      secretOrKey: process.env.JWT_SECRET || "your_jwt_secret", // Use the environment variable for JWT secret, fallback to a default
    },
    /**
     * Authenticate user by JWT.
     * @param {Object} jwtPayload - The payload decoded from the JWT.
     * @param {function} callback - The callback to pass the result of authentication.
     * @returns {function} - Returns the user object if authentication is successful, or false if unsuccessful.
     */
    async (jwtPayload, callback) => {
      return await Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    },
  ),
);
