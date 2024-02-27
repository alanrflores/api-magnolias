const server = require("express").Router();

const { updateSchedule } = require("../../controllers/schedule");


server.put("/:userId/:scheduleId", async (req, res) => {
  const { userId, scheduleId } = req.params;
  const scheduleData = req.body;
  console.log(scheduleData);

  try {

    await updateSchedule(userId, scheduleId, scheduleData);
    return res.status(200).json({
      success: true,
      message: "Schedule updated",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = server;
