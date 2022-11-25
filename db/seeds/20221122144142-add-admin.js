'use strict';
const controllers = require("../../app/controllers");

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Admins', [{
      email: 'superadmin@gmail.com',
      password: await controllers.api.v1.adminController.encryptPassword("superadmin"),
      role: 'superAdmin',
      name: 'super Admin',
      username:'superAdmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Admins', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
