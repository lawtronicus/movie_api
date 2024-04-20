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
router.post("/login", async (req, res) => {
  try {
    const populatedUser = await Users.findById(req.user._id)
      .populate("favorite_movies")
      .exec();

    if (!populatedUser) {
      return res.status(400).send("User not found");
    }

    await new Promise((resolve, reject) => {
      req.login(populatedUser, { session: false }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    let token = generateJWTToken(populatedUser.toJSON());
    return res.json({ user: populatedUser, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
