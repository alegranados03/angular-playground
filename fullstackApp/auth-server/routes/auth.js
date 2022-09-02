const { Router } = require("express");
const { check } = require("express-validator");
const {
  refreshToken,
  newUser,
  login,
} = require("../controllers/authController");
const { validateFields } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.post(
  "/new",
  [
    check("name", "El nombre es requerido").not().isEmpty(),
    check("email", "El email es requerido").isEmail(),
    check("password", "El password es requerido").isLength({ min: 6 }),
    validateFields,
  ],
  newUser
);
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es requerido").isLength({ min: 6 }),
    validateFields,
  ],
  login
);
router.get("/renew",validarJWT,refreshToken);

module.exports = router;
