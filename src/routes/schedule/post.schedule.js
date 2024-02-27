const server = require("express").Router();
// const { entryTimeCheck, exitTimeCheck } = require("../../controllers/users");
const schedule = require("../../models/schedule");
const QRCode = require("qrcode");
const User = require("../../models/user");

async function generateQRCode(url) {
  try {
    const qrCodeUrl = await QRCode.toDataURL(url);
    return qrCodeUrl;
  } catch (err) {
    console.error(err);
  }
}

server.post("/", async (req, res) => {
  try {
    const { userId } = req.body;
    const now = new Date();

    // Buscar al usuario por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    // Verificar si ya existe un horario para la fecha actual
    const existingSchedule = user.schedule.find(
      (s) => s.date.toDateString() === now.toDateString()
    );

    if (existingSchedule) {
      // Si existe, actualiza la hora de salida a la fecha y hora actual
      existingSchedule.exitTime = now;
    } else {
      // Si no existe, crea un nuevo horario con la fecha y hora actual como entrada
      const newSchedule = {
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        entryTime: now,
        exitTime: null, // Inicialmente, el horario de salida está vacío
      };
      user.schedule.push(newSchedule);
    }

    // Guarda los cambios en el usuario
    await user.save();

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error al gestionar horarios:", error);
    return res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});


module.exports = server;
