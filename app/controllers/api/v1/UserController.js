/**
 * @file contains authentication request handler and its business logic
 * @author Fikri Rahmat Nurhidayat
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserServices = require("../../../services/userServices");
const SALT = 10;

//FUNCTION UNTUK ME ENCRYPT PASSWORD SAAT REGISTRASI
function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT, (err, encryptedPassword) => {
      if (!!err) {
        reject(err);
        return;
      }

      resolve(encryptedPassword);
    });
  });
}

//FUNCTION CHECK PASSWORD
function checkPassword(encryptedPassword, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect) => {
      if (!!err) {
        reject(err);
        return;
      }

      resolve(isPasswordCorrect);
    });
  });
}

//FUNCTION membuat token yg akan di kirimakan ke client
function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia");
}

module.exports = {
  encryptPassword,
  //FUNCTION UNTUK REGISTER
  async register(req, res) {
    const no_ktp = "";
    const no_passport = "";
    const address = "";
    const date_of_birth = req.body.date_of_birth;
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const sex = req.body.sex;
    const password = await encryptPassword(req.body.password);
    const user = await UserServices.create({
      no_ktp,
      no_passport,
      sex,
      date_of_birth,
      address,
      email,
      password,
      name,
      username,
    });
    res.status(201).json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  },

  async updateUser(req, res) {
    const no_ktp = req.body.no_ktp;
    const no_passport = req.body.no_passport;
    const sex = req.body.sex;
    const date_of_birth = req.body.date_of_birth;
    const address = req.body.address;
    const email = req.body.email;
    const name = req.body.name;
    const username = req.body.username;
    const password = !req.body.password ? req.user.password : await encryptPassword(req.body.password);
    UserServices.update(req.user.id, {
      no_ktp: no_ktp,
      no_passport: no_passport,
      sex: sex,
      date_of_birth: date_of_birth,
      address: address,
      email: email,
      name: name,
      username: username,
      password : password,
    })
      .then(() => {
        res.status(200).json({
          status: "SUCCESS",
          message: "Update User successfully",
        });
      })
      .catch((err) => {
        res.status(422).json({
          status: "FAIL",
          message: err.message,
        });
      });
  },

  //FUNCTION LOGIN
  async login(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserServices.findOne({
      where: { username },
    });

    //pengecekan username
    if (!user) {
      res.status(404).json({ message: "Username tidak ditemukan" });
      return;
    }

    //pengecekan password yang telah di compare dari method checkPassword()
    const isPasswordCorrect = await checkPassword(user.password, password);
    //PENGECEKAN JIKA PASSWORD SALAH
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Password salah!" });
      return;
    }

    //TOKEN DI BUAT DARI METHOD createToken(), LALU DI MASUKUAN KE DALAM KE DALAM TOKEN
    const token = createToken({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    //RESPON YANG DI TAMPILKAN KE CLIENT
    res.status(201).json({
      id: user.id,
      email: user.email,
      username: user.username,
      token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  },

  //FUNCTION UNTUK MENGETAHUI SIAPA YANG SEDANG MENGAKSES DATA
  async whoAmI(req, res) {
    res.status(200).json(req.user);
  },

  //FUNCTION UNTUK PENGECEKAN SAAT LOGIN
  async authorize(req, res, next) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const tokenPayload = jwt.verify(
        token,
        process.env.JWT_SIGNATURE_KEY || "Rahasia"
      );

      //PENCARIAN DATA USER BERDASARKAN DARI TOKEN ID YANG LOGIN
      req.user = await UserServices.findByPk(tokenPayload.id);
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  },
};
