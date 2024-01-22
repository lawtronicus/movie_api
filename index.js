const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();

// create a write stream (in append mode)
// a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

const topMovies = {
  1: {
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
  },
  2: {
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
  },
  3: {
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
  },
  4: {
    title: "No Country for Old Men",
    director: ["Joel Coen", "Ethan Coen"],
    writer: ["Joel Coen", "Ethan Coen"],
    cast: ["Tommy Lee Jones", "Javier Bardem", "Josh Brolin"],
  },
  5: {
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
  },
  6: {
    title: "The Tree of Life",
    director: ["Terrence Malick"],
    writer: ["Terrence Malick"],
    cast: ["Brad Pitt", "Sean Penn", "Jessica Chastain"],
  },
  7: {
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
  },
  8: {
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
  },
  9: {
    title: "La Haine [Hate]",
    director: ["Mathieu Kassovitz"],
    writer: ["Mathieu Kassovitz"],
    cast: ["Vincent Cassel", "Hubert Koundé", "Said Taghmaoui"],
  },
  10: {
    title: "Les Parapluies de Cherbourg [The Umbrellas of Cherbourg",
    director: ["Jacques Demy"],
    writer: ["Jacques Demy"],
    cast: [
      "Catherine Deneuve",
      "Anne Vernon",
      "Nino Casteinuovo",
      "Marc Michel",
    ],
  },
};

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

// also log to console
app.use(morgan("dev"));

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to my movie app!");
});

app.use(express.static("public"));

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("There was an error");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
