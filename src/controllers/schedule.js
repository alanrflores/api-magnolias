const Schedule = require("../models/schedule");
const user = require("../models/user");
const User = require("../models/user");
const mongoose = require("mongoose");

const findAllSchedules = async (filters) => {
  try {
    return await Schedule.find(filters || {});
  } catch (err) {
    throw new Error(err.message);
  }
};

const findScheduleById = async (scheduleId) => {
  try {
    if (scheduleId && mongoose.Types.ObjectId.isValid(scheduleId)) {
      const schedule = await Schedule.findOne({ _id: scheduleId });
      if (!schedule) {
        throw new Error("Schedule not found");
      }
      return schedule;
    } else {
      throw new Error("Invalid schedule ID");
    }
  } catch (error) {
    throw new Error("Error fetching schedule by ID");
  }
};

// const createSchedule = async (scheduleData) => {
//   try {
//     const newSchedule = new Schedule(scheduleData);
//     await newSchedule.save();
//     return newSchedule;
//   } catch {
//     throw new Error("Error creating schedule");
//   }
// };

const updateSchedule = async (userId, scheduleId, scheduleData) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    user.schedule.forEach((s) => {
      if (s._id.toString() === scheduleId) {
        s.entryTime = scheduleData.entryTime;
        s.exitTime = scheduleData.exitTime;
      }
    });

    await user.save();
  } catch (error) {
    throw new Error("Error no puede actualizar el horario");
  }
};

const deleteSchedule = async (userId, scheduleId) => {
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new Error("User not found");
    }
    const scheduleIndex = user.schedule.findIndex(
      (s) => s._id.toString() === scheduleId
    );

    if (scheduleIndex === -1) {
      throw new Error("Schedule not found");
    }
    user.schedule.splice(scheduleIndex, 1);
    await user.save();

    return user.schedule[scheduleIndex];
  } catch (error) {
    throw new Error("Error deleting schedule");
  }
};

module.exports = {
  findAllSchedules,
  findScheduleById,
  //   createSchedule,
  updateSchedule,
  deleteSchedule,
};
