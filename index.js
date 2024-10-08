const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");
const { Movie } = require("./models.js");
mongoose = require("mongoose");
Models = require("./models.js");
const { check, validationResult } = require("express-validator");
const { isUnique } = require("./validation.js");
const app = express();
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Actors = Models.Actor;
const Genres = Models.Genre;

const cors = require("cors");

let allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:1234",
  "http://testsite.com",
  "https://my-flix-application.netlify.app",
];

/**
 * Enables CORS for specified origins.
 *
 * The `cors` middleware allows restricted access from certain domains specified in the `allowedOrigins` array.
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  }),
);

// Connect to MongoDB Atlas using the URI from the environment variable
mongoose.connect(process.env.CONNECTION_URI);

// Body parser middleware to parse incoming JSON requests
app.use(bodyParser.json());

/**
 * Import authentication logic.
 */
let auth = require("./auth")(app);

/**
 * Initialize Passport for JWT authentication.
 */
const passport = require("passport");
require("./passport");

// Create a write stream for logging HTTP requests to the "log.txt" file
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

/**
 * Morgan middleware to log all HTTP requests to the file stream.
 */
app.use(morgan("combined", { stream: accessLogStream }));

/**
 * Also log requests to the console.
 */
app.use(morgan("dev"));

/**
 * GET request handler for the root route.
 *
 * @name WelcomeMessage
 * @route {GET /}
 * @returns {string} - A welcome message.
 */
app.get("/", (req, res) => {
  res.send("Welcome to my movie app!");
});

/**
 * Serves static files from the "public" directory.
 */
app.use(express.static("public"));

// get a list of all movies
/**
 * GET a list of all movies.
 *
 * @name GetAllMovies
 * @route {GET /movies}
 * @authentication This route requires JWT authentication.
 * @returns {Array} - A list of movie objects, each populated with directors, main_actor, and genres.
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .populate("directors")
      .populate("main_actor")
      .populate("genres")
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// get info of a given movie
/**
 * GET details of a specific movie by title.
 *
 * @name GetMovieByTitle
 * @route {GET /movies/:title}
 * @authentication This route requires JWT authentication.
 * @param {string} title - The title of the movie.
 * @returns {Object} - The movie object with details populated (directors, main_actor).
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Movies.findOne({ title: req.params.title })
      .populate("directors")
      .populate("main_actor")
      .then((movie) => {
        if (movie) {
          res.json(movie);
        } else {
          res
            .status(404)
            .send(`Movie with title ${req.params.title} not found`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// get a particular movie's director
/**
 * GET a movie's director information by the movie title.
 *
 * @name GetMovieDirectors
 * @route {GET /movies/:title/directors}
 * @authentication This route requires JWT authentication.
 * @param {string} title - The title of the movie.
 * @returns {Object} - The title of the movie and its directors.
 */
app.get(
  "/movies/:title/directors",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ title: req.params.title })
      .populate("directors")
      .then((movie) => {
        if (movie) {
          res.json({
            title: movie.title,
            directors: movie.directors,
          });
        } else {
          res
            .status(404)
            .send(`Movie with title ${req.params.title} not found`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// get a movie's writer
/**
 * GET a movie's writer information by the movie title.
 *
 * @name GetMovieWriters
 * @route {GET /movies/:title/writers}
 * @authentication This route requires JWT authentication.
 * @param {string} title - The title of the movie.
 * @returns {Object} - The title of the movie and its writers.
 */
app.get(
  "/movies/:title/writers",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ title: req.params.title })
      .then((movie) => {
        if (movie) {
          res.json({
            title: movie.title,
            writers: movie.writers,
          });
        } else {
          res
            .status(404)
            .send(`Movie with title ${req.params.title} not found`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// get a particular movie's cast
/**
 * GET a movie's main actor by the movie title.
 *
 * @name GetMovieMainActor
 * @route {GET /movies/:title/main_actor}
 * @authentication This route requires JWT authentication.
 * @param {string} title - The title of the movie.
 * @returns {Object} - The title of the movie and its main actor.
 */
app.get(
  "/movies/:title/main_actor",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ title: req.params.title })
      .populate("main_actor")
      .then((movie) => {
        if (movie) {
          console.log(movie);
          res.json({
            title: movie.title,
            main_actor: movie.main_actor,
          });
        } else {
          res
            .status(404)
            .send(`Movie with title ${req.params.title} not found`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// get a particular movie's description
/**
 * GET a movie's description by the movie title.
 *
 * @name GetMovieDescription
 * @route {GET /movies/:title/description}
 * @authentication This route requires JWT authentication.
 * @param {string} title - The title of the movie.
 * @returns {Object} - The title of the movie and its description.
 */
app.get(
  "/movies/:title/description",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ title: req.params.title })
      .then((movie) => {
        if (movie) {
          res.json({
            title: movie.title,
            description: movie.description,
          });
        } else {
          res
            .status(404)
            .send(`Movie with title ${req.params.title} not found`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// get a particular movie's image url
/**
 * GET a movie's image URL by the movie title.
 *
 * @name GetMovieImage
 * @route {GET /movies/:title/image}
 * @authentication This route requires JWT authentication.
 * @param {string} title - The title of the movie.
 * @returns {Object} - The title of the movie and its image URL.
 */
app.get(
  "/movies/:title/image",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ title: req.params.title })
      .then((movie) => {
        if (movie) {
          res.json({
            title: movie.title,
            imageurl: movie.imageurl,
          });
        } else {
          res
            .status(404)
            .send(`Movie with title ${req.params.title} not found`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// get a particular movie's genre
/**
 * GET a movie's genres by the movie title.
 *
 * @name GetMovieGenres
 * @route {GET /movies/:title/genre}
 * @authentication This route requires JWT authentication.
 * @param {string} title - The title of the movie.
 * @returns {Object} - The title of the movie and its genres.
 */
app.get(
  "/movies/:title/genre",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ title: req.params.title })
      .populate("genres")
      .then((movie) => {
        if (movie) {
          res.json({
            title: movie.title,
            genres: movie.genres,
          });
        } else {
          res
            .status(404)
            .send(`Movie with title ${req.params.title} not found`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// get info about a director
/**
 * GET information about a director by their name.
 *
 * @name GetDirectorByName
 * @route {GET /directors/:directorName}
 * @authentication This route requires JWT authentication.
 * @param {string} directorName - The name of the director.
 * @returns {Object} - The director's details (e.g., name, bio, birthdate, deathdate).
 */
app.get(
  "/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Directors.findOne({ name: req.params.directorName })
      .then((director) => {
        if (director) {
          res.json(director);
        } else {
          res
            .status(404)
            .send(`Director with name ${req.params.directorName} not found.`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// get film genre description
/**
 * GET information about a genre by its name.
 *
 * @name GetGenreByName
 * @route {GET /genres/:genreName}
 * @authentication This route requires JWT authentication.
 * @param {string} genreName - The name of the genre.
 * @returns {Object} - The genre's details (e.g., name, description).
 */
app.get(
  "/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Genres.findOne({ name: req.params.genreName })
      .then((genre) => {
        if (genre) {
          res.json(genre);
        } else {
          res
            .status(404)
            .send(`Genre with name ${req.params.genreName} not found.`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// Get all users
/**
 * GET all users.
 *
 * @name GetAllUsers
 * @route {GET /users}
 * @authentication This route requires JWT authentication.
 * @returns {Array} - A list of user objects.
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// Add a new user
/**
 * POST a new user.
 *
 * @name CreateUser
 * @route {POST /users}
 * @authentication No authentication required.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password (hashed).
 * @param {string} email - The user's email.
 * @param {string} dob - The user's date of birth (optional).
 * @returns {Object} - The created user object.
 */
app.post(
  "/users",
  [
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.password);
    await Users.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + " already exists");
        } else {
          Users.create({
            username: req.body.username || null,
            password: hashedPassword,
            email: req.body.email,
            dob: req.body.dob || null,
            favorite_movies: [],
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  },
);

// Get a user by ID
/**
 * GET a user by their ID.
 *
 * @name GetUserById
 * @route {GET /users/:ID}
 * @authentication This route requires JWT authentication.
 * @param {string} ID - The user's unique ID.
 * @returns {Object} - The user object.
 */
app.get(
  "/users/:ID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ _id: req.params.ID })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  },
);

// Update user info
/**
 * PUT to update a user's information.
 *
 * @name UpdateUser
 * @route {PUT /users/:id}
 * @authentication This route requires JWT authentication.
 * @param {string} id - The user's unique ID.
 * @param {string} username - The user's new username (optional).
 * @param {string} email - The user's new email (optional).
 * @param {string} dob - The user's new date of birth (optional).
 * @returns {Object} - The updated user object.
 */
app.put(
  "/users/:id/",
  [
    check("username")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters")
      .isAlphanumeric()
      .withMessage(
        "Username contains non-alphanumeric characters - not allowed.",
      ),
    check("email")
      .optional()
      .isEmail()
      .withMessage("Email does not appear to be valid"),
    check("dob")
      .optional()
      .isISO8601()
      .withMessage("Date of birth must be a valid ISO 8601 date"),
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("username: ", req.body.username);
    console.log("password: ", req.body.password);
    let errors = validationResult(req);
    let hashedPassword = Users.hashPassword(req.body.password);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Ensure the user is modifying their own info
    if (req.user.id !== req.params.id) {
      return res.status(400).send("Permission denied");
    }

    // Check if the username is unique
    const isUsernameUnique = await isUnique("username", req.body.username);

    if (!isUsernameUnique && req.body.username != null) {
      return res.status(400).send({ message: "Username already exists." });
    }

    const thisUser = await Users.findOne({ _id: req.params.id });
    const isValid = thisUser.validatePassword(req.body.password);
    if (!isValid) {
      return res.status(400).send({ message: "Password incorrect" });
    }

    await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          dob: req.body.birthday,
        },
      },
      { new: true },
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res
            .status(404)
            .send(`User with ID ${req.params.id} not found.`);
        }
        res.json(updatedUser);
      })
      .catch((err) => {
        res.status(500).send("Error: " + err);
      });
  },
);

// Add movie to user's list of favorites
/**
 * PUT to add a movie to the user's list of favorite movies.
 *
 * @name AddFavoriteMovie
 * @route {PUT /users/:userId/:movieTitle}
 * @authentication This route requires JWT authentication.
 * @param {string} userId - The user's unique ID.
 * @param {string} movieTitle - The title of the movie to add.
 * @returns {Object} - The updated user object with the new favorite movie.
 */
app.put(
  "/users/:userId/:movieTitle",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("req.user.id: ", req.user.id);
    console.log("req.params.userId: ", req.params.userId);

    if (req.user.id !== req.params.userId) {
      return res.status(400).send("Permission denied");
    }

    const { userId, movieTitle } = req.params;
    try {
      const movie = await Movies.findOne({ title: movieTitle });
      if (!movie) {
        return res.status(404).send(`Movie with title ${movieTitle} not found`);
      }

      const updatedUser = await Users.findByIdAndUpdate(
        userId,
        { $addToSet: { favorite_movies: movie._id } },
        { new: true },
      ).populate({
        path: "favorite_movies",
      });

      if (!updatedUser) {
        return res.status(404).send(`User with ID ${userId} not found.`);
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  },
);

// Delete a movie from a user's favorite movie list
/**
 * DELETE a movie from the user's list of favorite movies.
 *
 * @name RemoveFavoriteMovie
 * @route {DELETE /users/:userId/:movieTitle}
 * @authentication This route requires JWT authentication.
 * @param {string} userId - The user's unique ID.
 * @param {string} movieTitle - The title of the movie to remove.
 * @returns {Object} - The updated user object without the removed favorite movie.
 */
app.delete(
  "/users/:userId/:movieTitle",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.id !== req.params.userId) {
      return res.status(400).send("Permission denied");
    }

    const { userId, movieTitle } = req.params;
    try {
      const movie = await Movies.findOne({ title: movieTitle });
      if (!movie) {
        return res
          .status(404)
          .send(`Movie with the title ${movieTitle} not found`);
      }

      const updatedUser = await Users.findByIdAndUpdate(
        userId,
        { $pull: { favorite_movies: movie._id } },
        { new: true },
      ).populate({
        path: "favorite_movies",
      });

      if (!updatedUser) {
        return res.status(404).send(`User with ID ${userId} not found.`);
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  },
);

// Delete a user
/**
 * DELETE a user by their ID.
 *
 * @name DeleteUser
 * @route {DELETE /users/:userId}
 * @authentication This route requires JWT authentication.
 * @param {string} userId - The user's unique ID.
 * @returns {string} - A success message confirming deletion, or an error if the user is not found.
 */
app.delete(
  "/users/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Condition to ensure the user is attempting to delete their own account
    if (req.user.id !== req.params.userId) {
      console.log(req.user.id);
      console.log(req.params.userId);
      return res.status(400).send("Permission denied");
    }
    try {
      const user = await Users.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res.status(400).send(req.params.userId + " was not found");
      } else {
        return res.status(200).send(req.params.userId + " was deleted.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  },
);

// General error handler
/**
 * Global error handler for the application.
 *
 * @name ErrorHandler
 * @param {Error} err - The error object.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {function} next - The next middleware function in the request-response cycle.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("There was an error");
});

// Server setup
/**
 * Start the server on the specified port (default 8080).
 *
 * @name StartServer
 * @param {number} port - The port number to listen on (default 8080).
 */
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
