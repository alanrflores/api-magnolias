const server = require("express").Router();
const { deleteSchedule } = require("../../controllers/schedule");

server.delete("/:userId/:scheduleId", async (req, res) => {
    const { userId, scheduleId } = req.params;

  try {
    const schedule = await deleteSchedule(userId, scheduleId);
    return res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = server;
