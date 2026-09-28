const Sleep = require("../models/Sleep");

const getWeeklySleep = async (req, res) => {
  try {
    const { startOfWeek } = req.query;

    if (!startOfWeek) {
      return res
        .status(400)
        .json({ message: "Missing required query parameter: startOfWeek" });
    }

    const parsedDate = new Date(startOfWeek);
    // Check if the date string parsed into a valid timestamp
    if (isNaN(parsedDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format provided for startOfWeek." });
    }

    let sleepLog = await Sleep.findOne({
      userId: req.user.id,
      weekStartDate: parsedDate,
    });

    if (!sleepLog) {
      return res.status(200).json({
        weekStartDate: startOfWeek,
        sleepHours: {
          Mon: 6.5,
          Tue: 7.2,
          Wed: 6.8,
          Thu: 8.1,
          Fri: 7.2,
          Sat: 0,
          Sun: 0,
        },
      });
    }

    res.status(200).json(sleepLog);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateWeeklySleep = async (req, res) => {
  // 1. Terminal Debug Logs - Look at your backend console when you type!
  console.log("--- Incoming Save Attempt ---");
  console.log("Received Body:", req.body);
  console.log("Received User Context:", req.user);

  const { startOfWeek, day, hours } = req.body;

  if (!startOfWeek || !day || hours === undefined) {
    return res.status(400).json({ message: "Missing required body fields." });
  }

  try {
    // 2. Auth Fallback Guard:
    // If you don't have auth middleware active yet, we use a temporary placeholder ID
    // so your database can still save your progress successfully.
    const finalUserId = req.user?.id || "64b0f1a2c3d4e5f6a7b8c9d0";

    const updatedLog = await Sleep.findOneAndUpdate(
      {
        userId: finalUserId,
        weekStartDate: new Date(startOfWeek),
      },
      {
        $set: { [`sleepHours.${day}`]: Number(hours) },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    console.log("Successfully Saved To MongoDB:", updatedLog);
    res.status(200).json(updatedLog);
  } catch (error) {
    console.error("Mongoose Database Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error saving sleep data." });
  }
};

module.exports = {
  getWeeklySleep,
  updateWeeklySleep,
};
