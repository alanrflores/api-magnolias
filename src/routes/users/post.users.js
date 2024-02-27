const server = require("express").Router();
const {
  createUser,
  loginUser,
  sendPasswordResetEmail,
} = require("../../controllers/users");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../../models/user");

server.post("/", async (req, res) => {
  const userData = req.body;

  try {
    const newUser = await createUser(userData);
    return res.status(200).json({
      success: true,
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

server.post("/password-reset", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "No existe un usuario con ese correo electrónico." });
    }

    const token = uuid.v4();
    console.log(token);
    const expires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    await sendPasswordResetEmail(email, token);

    return res.status(200).json({
      message:
        "Se ha enviado un correo con las instrucciones para restablecer tu contraseña.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

server.post("/password-reset/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: "El token ha expirado." });
      }

      const saltRounds = 10;
      const passHashed = bcrypt.hashSync(password, saltRounds);
      user.password = passHashed;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(200).json({ message: "Contraseña actualizada." });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  });

module.exports = server;
