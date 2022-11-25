const adminRepository = require("../repositories/adminRepository");


module.exports = {
  create(requestBody) {
    return adminRepository.create(requestBody);
  },

  update(id, requestBody) {
    return adminRepository.update(id, requestBody);
  },

  delete(id) {
    return adminRepository.delete(id);
  },

  async list() {
    try {
      const admins = await adminRepository.findAll();
      const adminCount = await adminRepository.getTotalAdmin();

      return {
        data: admins,
        count: adminCount,
      };
    } catch (err) {
      throw err;
    }
  },

  get(id) {
    return adminRepository.find(id);
  },

  findOne(id){
    return adminRepository.findOne(id)
  },

  findByPk(id){
    return adminRepository.findByPk(id)
  }

  
};
