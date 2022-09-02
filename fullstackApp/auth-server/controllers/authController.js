const { request, response } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "no user with that email",
      });
    }

    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) {
      return res.status(400).json({
        ok: false,
        msg: "no password correcta",
      });
    }

    const token = await generarJWT(user.id, user.name);
    return res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      msg: "login usuario",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "login failed",
    });
  }
};

const newUser = async (req = request, res = response) => {
  const { name, password, email } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con este email",
      });
    }

    const dbUser = new Usuario(req.body);
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    const token = await generarJWT(dbUser.id, name);

    await dbUser.save();
    return res.status(201).json({
      ok: true,
      msg: "Usuario creado",
      uid: dbUser.id,
      name,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "falló crear un usuario",
    });
  }
};

const refreshToken = async (req, res = response) => {
  const { uid, name } = req;
  const token = await generarJWT(uid, name);

  return res.json({
    ok: true,
    msg: "validar jwt",
    token,
    uid,
    name,
  });
};

module.exports = {
  login: login,
  newUser: newUser,
  refreshToken: refreshToken,
};
