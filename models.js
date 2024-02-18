const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  dob: Date,
  favorite_movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

let genreSchema = mongoose.Schema({
  name: String,
  description: String,
});

let directorSchema = mongoose.Schema({
  name: String,
  bio: String,
  dob: String,
  dod: String, //dod = Date of Death
});

let actorSchema = mongoose.Schema({
  name: String,
  dob: Date,
  bio: String,
});

let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director" }],
  main_actor: { type: mongoose.Schema.Types.ObjectId, ref: "Actor" },
  writers: [String],
  imageurl: String,
  Featured: Boolean,
});

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Genre = mongoose.model("Genre", genreSchema);
let Director = mongoose.model("Director", directorSchema);
let Actor = mongoose.model("Actor", actorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.Actor = Actor;
