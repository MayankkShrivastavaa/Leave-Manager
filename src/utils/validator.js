const mongoose = require("mongoose")

const isValid = (input) => {
  if (typeof input === "undefined" || input === null) return false;
  if (typeof input === "string" && input.trim().length === 0) return false;
  if (typeof input === "number" && isNaN(input)) return false;

  return true;
};

const isValidName = (input) => /^[a-zA-Z ]+$/.test(input);

const isValidEmail = (input) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);

const isValidPassword = (input) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/.test(
    input,
  );

const isValidObjectId = (objectId) => mongoose.Types.ObjectId.isValid(objectId);

module.exports = {
  isValid,
  isValidName,
  isValidEmail,
  isValidPassword,
  isValidObjectId,
};
