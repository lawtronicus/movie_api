const Models = require("./models.js");
let Users = Models.User;

/**
 * Checks if a specific field in the Users collection is unique.
 *
 * This function can be used to validate if a specific field, such as email or username,
 * is already in use by another user.
 *
 * @param {string} field - The field to check for uniqueness (e.g., "email", "username").
 * @param {string} value - The value of the field to check for uniqueness.
 * @param {string|null} [userId=null] - Optional. The ID of the user to exclude from the uniqueness check. This is useful for updates, where the current user's field should not be considered a duplicate.
 * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if the field is unique, `false` otherwise.
 *
 * @example
 * // Check if email is unique (for new users)
 * const isEmailUnique = await isUnique('email', 'user@example.com');
 *
 * @example
 * // Check if username is unique (for updating a user, excluding their own ID)
 * const isUsernameUnique = await isUnique('username', 'new_username', 'user_id_here');
 */
async function isUnique(field, value, userId = null) {
  const query = { [field]: value };

  // Exclude the current user if updating
  if (userId) {
    query._id = { $ne: userId };
  }

  // Check for an existing user with the same field value
  const user = await Users.findOne(query);

  // If no user is found, the field is unique
  return !user;
}

module.exports = {
  isUnique,
  // Add other validation functions here when created
};
