const httpStatus = require("http-status");
const User = require("./user.model");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

const getAllUsers = async () => {
  return User.find({ role: "buyer" });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserLoggedOutState = async (userId, isLoggedOut) => {
  const updated = await User.findByIdAndUpdate(
    userId,
    {
      $set: { isLoggedOut }
    },
    {
      new: true,          // return updated doc
      runValidators: true,
      context: "query",
    }
  );

  if (!updated) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return updated;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  // console.log("UPDATED BODY", updateBody);

  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: updateBody },
    {
      new: true, // return the updated document
      runValidators: true, // schema validation
      context: "query", // needed for some validators
    }
  );

  if (!updated) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  // await user.save();
  return updated;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getAllUsers,
  updateUserLoggedOutState
};
