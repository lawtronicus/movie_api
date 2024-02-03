const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();

// set up bodyParser

app.use(bodyParser.json());

// create a write stream (in append mode)
// a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

const topMovies = [
  {
    title: "Pan's Labyrinth",
    director: ["Guillermo del Toro"],
    writer: ["Guillermo del Toro"],
    cast: [
      "Ivana Baquero",
      "Doug Jones",
      "Arianda Gil",
      "Sergi Lopez",
      "Mribel Verdu",
      "Alex Angula",
    ],
    description: "description of Pan's Labyrinth",
    imageUrl: "",
    featured: true,
    genre: ["fantasy"],
  },
  {
    title: "Vertigo",
    director: ["Alfred Hitchcock"],
    writer: ["Alec Coppel", "Samuel A. Taylor"],
    cast: [
      "James Stewart",
      "Kim Novak",
      "Barbara Bel Geddes",
      "Tom Helmore",
      "Henry Jones",
    ],
    description: "description of Vertigo",
    imageUrl: "",
    featured: true,
    genre: ["suspense"],
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    director: ["Michel Gondry"],
    writer: ["Charlie Kaufman"],
    cast: [
      "Jim Carey",
      "Kate Winslet",
      "Kirsten Dunst",
      "Mark Ruffalo",
      "Elijah Wood",
      "Tom Wilkinson",
    ],
    description: "description of Eternal Sunshine of hte Spotless Mind",
    imageUrl: "",
    featured: true,
    genre: ["drama"],
  },
  {
    title: "No Country for Old Men",
    director: ["Joel Coen", "Ethan Coen"],
    writer: ["Joel Coen", "Ethan Coen"],
    cast: ["Tommy Lee Jones", "Javier Bardem", "Josh Brolin"],
    description: "description of No Country for Old Men",
    imageUrl: "",
    featured: true,
    genre: ["drama"],
  },
  {
    title: "Jurassic Park",
    director: ["Steven Spielberg"],
    writer: ["Michael Crichton", "David Koepp"],
    cast: [
      "Sam Neill",
      "Laura Dern",
      "Jeff Goldblum",
      "Richard Attenborough",
      "Bob Peck",
      "Martin Ferrero",
      "BD Wong",
      "Samuel L. Jackson",
      "Wayne Knight",
      "Joseph Mazzello",
      "Ariana Richards",
    ],
    description: "description of Jurassic Park",
    imageUrl: "",
    featured: true,
    genre: ["sci-fi", "horror", "adventure"],
  },
  {
    title: "The Tree of Life",
    director: ["Terrence Malick"],
    writer: ["Terrence Malick"],
    cast: ["Brad Pitt", "Sean Penn", "Jessica Chastain"],
    description: "description of the Tree of LIfe",
    imageUrl: "",
    featured: true,
    genre: ["experimental", "drama"],
  },
  {
    title: "The Empire Strikes Back",
    director: ["Irvin Kershner"],
    writer: ["Leigh Brackett", "Lawrence Kasdan"],
    cast: [
      "Mark Hamill",
      "Harrison Ford",
      "Carrie Fisher",
      "Billy Dee Williams",
      "Anthony Daniels",
      "David Prowse",
      "Kenny Baker",
      "Peter Mayhew",
      "Frank Oz",
    ],
    description: "description of the Empire Strike's Back",
    imageUrl: "",
    featured: true,
    genre: ["sci-fi"],
  },
  {
    title: "Toy Story",
    director: ["John Lasseter"],
    writer: ["Joss Whedon", "Andrew Stanton", "Joel Cohen", "Alec Sokolow"],
    cast: [
      "Tom Hanks",
      "Tim Allen",
      "Annie Potts",
      "John Ratzenberger",
      "Don Rickles",
      "Wallace Shawn",
      "Jim Varney",
    ],
    description: "description of Toy Story",
    imageUrl: "",
    featured: true,
    genre: ["animated"],
  },
  {
    title: "La Haine [Hate]",
    director: ["Mathieu Kassovitz"],
    writer: ["Mathieu Kassovitz"],
    cast: ["Vincent Cassel", "Hubert Koundé", "Said Taghmaoui"],
    description: "description of La Haine",
    imageUrl: "",
    featured: true,
    genre: ["drama"],
  },
  {
    title: "Les Parapluies de Cherbourg [The Umbrellas of Cherbourg]",
    director: ["Jacques Demy"],
    writer: ["Jacques Demy"],
    cast: [
      "Catherine Deneuve",
      "Anne Vernon",
      "Nino Casteinuovo",
      "Marc Michel",
    ],
    description: "description of les Paraplueis de Cherbourg",
    imageUrl: "",
    featured: true,
    genre: ["musical"],
  },
];

let users = [
  {
    id: 12345,
    name: "First Last",
    favoriteMovies: [],
  },
];

const directors = [
  {
    name: "Jean Vigo",
    birthYear: 1905,
    deathYear: 1934,
    filmography: ["L'Atlante"],
    bio: "Vigo was born to Emily Clero and the militant anarchist Miguel Almereyda. Much of Vigo's early life was spent on the run with his parents. His father was imprisoned and probably murdered in Fresnes Prison on 13 August 1917, although the death was officially a suicide. Some speculated that Almereyda's death was hushed up on orders of the Radical politicians Louis Malvy and Joseph Caillaux, who were later punished for wartime treason.[1] The young Vigo was subsequently sent to boarding school under an assumed name, Jean Sales, to conceal his identity. Vigo was married and had a daughter, Luce Vigo, a film critic, in 1931. He died in 1934 of complications from tuberculosis, which he had contracted eight years earlier.",
    imageUrl: "",
  },
];

const genres = [
  {
    name: thriller,
    description:
      "A film or literary genre that uses various techniques to provoke a sense of suspense and excitement in the audience.",
  },
];

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
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// get info of a given movie
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = topMovies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send(`The movie ${movie} does not exist`);
  }
});

// get a particular movie' director
app.get("/movies/:title/director", (req, res) => {
  const movie = topMovies.find((movie) => {
    return movie.title === req.params.title;
  });
  if (movie) {
    const director = movie.director;
    res.status(200).json({ director: director });
  } else {
    res
      .status(404)
      .send("Movie with the title " + req.params.title + " was not found");
  }
});

// get a movie's writer
app.get("/movies/:title/writer", (req, res) => {
  const movie = topMovies.find((movie) => {
    return movie.title === req.params.title;
  });
  if (movie) {
    const writer = movie.writer;
    res.status(200).json({ writer: writer });
  } else {
    res
      .status(404)
      .send("Movie with the title " + req.params.title + " was not found");
  }
});

// get a particular movie's cast
app.get("/movies/:title/cast", (req, res) => {
  const movie = topMovies.find((movie) => {
    return movie.title === req.params.title;
  });
  if (movie) {
    const cast = movie.cast;
    res.status(200).json({ cast: movie.cast });
  } else {
    res
      .status(404)
      .send("Movie with the title " + req.params.title + " was not found");
  }
});

// get a particular movie's description
app.get("/movies/:title/description", (req, res) => {
  const movie = topMovies.find((movie) => {
    return movie.title === req.params.title;
  });
  if (movie) {
    const description = movie.description;
    res.status(200).json({ description: movie.description });
  } else {
    res
      .status(404)
      .send("Movie with the title " + req.params.title + " was not found");
  }
});

// get a particular movie's image url
app.get("/movies/:title/image", (req, res) => {
  const movie = topMovies.find((movie) => {
    return movie.title === req.params.title;
  });
  if (movie) {
    const imageUrl = movie.image;
    res.status(200).send({ imageUrl: imageUrl });
  } else {
    res
      .status(404)
      .send("Movie with the title " + req.params.title + " was not found");
  }
});

// get a particular movie's genre
app.get("/movies/:title/genre", (req, res) => {
  const movie = topMovies.find((movie) => {
    return movie.title === req.params.title;
  });
  if (movie) {
    const genre = movie.genre;
    res.status(200).send({ genre: genre });
  } else {
    res
      .status(404)
      .send("Movie with the title " + req.params.title + " was not found");
  }
});

// get info about a director
app.get("/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = directors.find((director) => director.name === directorName);

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send(`The director ${directorName} does not exist`);
  }
});

// get film genre description
app.get("/genres/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = genres.find((genre) => genre.name === genreName);

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send(`The genre ${genreName} does not exist`);
  }
});

// create a new user
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("user must have a name");
  }
});

// Update user name
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(404).send(`User with id ${id} not found`);
  }
});

// Add movie to user's list of favorites
app.put("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res
      .status(200)
      .send(
        `${movieTitle} has been added to user ${user.id}'s favorite movies.`
      );
  } else {
    res.status(404).send(`User with id ${id} not found`);
  }
});

// Delete a movie from a user's favorite movie list
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.filter((title) => title !== movieTitle);
    res
      .status(200)
      .send(
        `${movieTitle} has been removed from user ${user.id}'s favorite movies.`
      );
  } else {
    res.status(404).send(`User with id ${id} not found`);
  }
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id !== id);
    res.status(200).send(`User with id ${id} has been deleted.`);
  } else {
    res.status(404).send(`User with id ${id} not found`);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("There was an error");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
