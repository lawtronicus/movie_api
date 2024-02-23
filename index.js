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

const app = express();
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Actors = Models.Actor;
const Genres = Models.Genre;

const cors = require("cors");

let allowedOrigins = ["http://localhost8080", "http://testsite.com"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOfg(origin) === -1) {
        let message =
          "The CORS policy for this application doesn't allow access form origin " +
          origin;
      }
      return callback(null, true);
    },
  })
);

// set to local connection
// mongoose.connect("mongodb://localhost:27017/mfDB");

//set to Atlas connection
mongoose.connect(process.env.CONNECTION_URI);

// set up bodyParser

app.use(bodyParser.json());

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

// create a write stream (in append mode)
// a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// also log to console
app.use(morgan("dev"));

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to my movie app!");
});

app.use(express.static("public"));

// get a list of all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// get info of a given movie
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ title: req.params.title })
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
    /*
    const { title } = req.params;
  const movie = topMovies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send(`The movie ${movie} does not exist`);
  }
  */
  }
);

// get a particular movie' director
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
        res.status(500).send("error: " + err);
      });
  }
);

// get a movie's writer
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
        res.status(500).send("error: " + err);
      });
  }
);

// get a particular movie's cast
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
        res.status(500).send("error: " + err);
      });
  }
);

// get a particular movie's description
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
        res.status(500).send("error: " + err);
      });
  }
);

// get a particular movie's image url
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
        res.status(500).send("error: " + err);
      });
  }
);

// get a particular movie's genre
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
        res.status(500).send("error: " + err);
      });
  }
);

// get info about a director
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
        res.status(500).send("error: " + err);
      });
  }
);

// get film genre description
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
        res.status(500).send("error: " + err);
      });
  }
);

// Get all users
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
  }
);

//Add a user
app.post(
  "/users",
  [
    check("username", "username is required").isLength({ min: 5 }),
    check(
      "username",
      "username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("password", "password is required").not().isEmpty(),
    check("email", "email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    await Users.findOne({ Username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + " already exists");
        } else {
          Users.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            dob: req.body.dob,
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
  }
);

// Get a user by id
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
  }
);

// update user info
app.put(
  "/users/:id/",
  [
    check("username", "username is required").isLength({ min: 5 }),
    check(
      "username",
      "username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("password", "password is required").not().isEmpty(),
    check("email", "email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    // Condition to ensure the user is attempting to change their own info
    if (req.user.id !== req.params.id) {
      return res.status(400).send("Permission denied");
    }
    await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          dob: req.body.birthday,
        },
      },
      { new: true }
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
  }
);

// Add movie to user's list of favorites
app.put(
  "/users/:userId/:movieTitle",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Condition to ensure the user is attempting to change their own info
    if (req.user.id !== req.params.id) {
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
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send(`User with ID ${userId} not found.`);
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

// Delete a movie from a user's favorite movie list
app.delete(
  "/users/:userId/:movieTitle",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Condition to ensure the user is attempting to change their own info
    if (req.user.id !== req.params.id) {
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
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send(`User with ID ${userId} not found.`);
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

// Delete a user
app.delete(
  "/users/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Condition to ensure the user is attempting to change their own info
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
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("There was an error");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
