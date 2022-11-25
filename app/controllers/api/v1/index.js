/**
 * @file contains entry point of controllers api v1 module
 * @author Fikri Rahmat Nurhidayat
 */

const adminController = require("./adminController");
const userController = require("./UserController");

module.exports = {
  adminController,
  userController
};
