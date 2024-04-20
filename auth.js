Models = require("./models.js");
const Users = Models.User;

const jwtSecret = "your_jwt_secret";

const jwt = require("jsonwebtoken");
passport = require("passport");
require("./passport");

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: String(user._id),
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

/* POST login. */
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
        .populate("favorite_movies")
        .then((populatedUser) => {
          console.log("Populated User:", populatedUser);
          // Proceed without using populated data yet
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
