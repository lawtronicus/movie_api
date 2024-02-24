const Models = require("./models.js");
let Users = Models.User;

async function isUnique(field, value, userId = null) {
  const query = { [field]: value };
  if (userId) {
    query._id = { $ne: userId };
  }
  const user = await Users.findOne(query);
  return !user;
}

module.exports = {
  isUnique,
  //add other validation functions here when created
};
