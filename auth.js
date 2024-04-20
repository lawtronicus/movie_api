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
      Users.findById(user._id)
        .populate("favorite_movies")
        .exec((err, populatedUser) => {
          if (err) {
            return res.status(500).send(err);
          }
          if (!populatedUser) {
            return res.status(400).send("User not found");
          }

          req.login(populatedUser, { session: false }, (error) => {
            if (error) {
              res.send(error);
            }
            // Ensure you are sending the populated user object
            let token = generateJWTToken(populatedUser.toJSON());
            return res.json({ user: populatedUser, token });
          });
        });
    })(req, res);
  });
};
