const server = require("express").Router();
const { findAllSchedules } = require("../../controllers/schedule");
const { findUserById, findAllUsers } = require("../../controllers/users");

server.get("/:id?", async (req, res) => {
  const { id } = req.params;

  if (id) {
    try {
      const user = await findUserById(id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  try {
    const schedules = await findAllUsers();

    return res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = server;
