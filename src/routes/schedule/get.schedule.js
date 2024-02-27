const { findAllSchedules } = require("../../controllers/schedule");
const Schedules = require("../../models/schedule");
const server = require("../users/get.users");

server.get("/:scheduleId", async (req, res) => {

  const scheduleId = req.params.scheduleId;

  if (scheduleId) {
     try {
       const schedule = await Schedules.findById(scheduleId).populate('user');
       console.log(schedule);
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
  }
  try {
    const allSchedules = await findAllSchedules().populate('user');

    const schedules = allSchedules.data.map((schedule) => {
    
      return  {
        id: schedule._id,
        user: schedule.user.map((user) => {
          return {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
          };
        }),
        date: schedule.date,
        entryTime: schedule.entryTime,
        exitTime: schedule.exitTime,
      };  
      }
    );

    console.log({allSchedules});
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
