const { Admin }  = require("../models");

module.exports = {

  create(createArgs) {
    return Admin.create(createArgs);
  },

  update(id, updateArgs) {
    return Admin.update(updateArgs, {
      where: {
        id,
      },
    });
  },

  delete(id) {
    return Admin.destroy(id);
  },

  findByPk(id) {
    return Admin.findByPk(id);
  },

  findOne(id) {
    return Admin.findOne(id);
  },

  findAll() {
    return Admin.findAll();
  },

  getTotalAdmin() {
    return Admin.count();
  },
};
