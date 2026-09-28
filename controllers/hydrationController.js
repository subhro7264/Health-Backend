// const Hydration = require('../models/Hydration');

// // GET /api/hydration/:userId
// exports.getHydration = async (req, res) => {

//     const { userId } = req.params;
//     try {
//         const record = await Hydration.findOne({ userId });
//         if (!record) {
//             return res.status(404).json({ error: "No profile found" });
//         }
//         return res.status(200).json(record);
//     } catch (err) {
//         return res.status(500).json({ error: "Server database read error" });
//     }
// };

// // POST /api/hydration
// exports.createHydration = async (req, res) => {
//     const { userId } = req.body; 
//     try {
//         if (!userId) return res.status(400).json({ error: "userId is required" });

//         const existing = await Hydration.findOne({ userId });
//         if (existing) return res.status(400).json({ error: "Record already exists" });

//         const newRecord = await Hydration.create({ userId });
//         return res.status(201).json(newRecord);
//     } catch (err) {
//         return res.status(500).json({ error: "Server database creation error" });
//     }
// };

// // PUT /api/hydration/:userId
// exports.updateHydration = async (req, res) => {
//     const { userId } = req.params;
//     const { current, customTarget } = req.body;
//     try {
//         const updatedRecord = await Hydration.findOneAndUpdate(
//             { userId },
//             { $set: { current, customTarget } },
//             { returnDocument: 'after' }
//         );
//         if (!updatedRecord) return res.status(404).json({ error: "Record missing" });
//         return res.status(200).json(updatedRecord);
//     } catch (err) {
//         return res.status(500).json({ error: "Server database modification error" });
//     }
// };



const Hydration = require('../models/Hydration');


const isPastDay = (storedDate) => {
    const today = new Date();
    const recordDate = new Date(storedDate);

    // Compare year, month, and date digits explicitly
    return (
        recordDate.getFullYear() < today.getFullYear() ||
        (recordDate.getFullYear() === today.getFullYear() && recordDate.getMonth() < today.getMonth()) ||
        (recordDate.getFullYear() === today.getFullYear() && recordDate.getMonth() === today.getMonth() && recordDate.getDate() < today.getDate())
    );
};


// GET /api/hydration/:userId
exports.getHydration = async (req, res) => {
    const { userId } = req.params;
    try {
        let record = await Hydration.findOne({ userId });
        
        if (!record) {
            // New user entry creation path
            record = await Hydration.create({ userId });
            return res.status(200).json(record);
        }

        // ⏰ DAILY RESET CHECK: If the log is from a past day, reset current to 0
        if (isPastDay(record.date)) {
            console.log(`Daily Reset triggered for user ${userId}. Wiping yesterday's progress.`);
            record.current = 0;
            record.date = new Date(); // Update tracking timestamp to today
            await record.save();
        }

        return res.status(200).json(record);
    } catch (err) {
        console.error("Error in getHydration:", err);
        return res.status(500).json({ error: "Server database read error" });
    }
};

// POST /api/hydration
exports.createHydration = async (req, res) => {
    
    const { userId } = req.body;
    try {
        if (!userId) return res.status(400).json({ error: "userId is required" });

        const existing = await Hydration.findOne({ userId });

        if (existing) return res.status(400).json({ error: "Record already exists" });

        const newRecord = await Hydration.create({ userId });

        return res.status(201).json(newRecord);
    } catch (err) {
        return res.status(500).json({ error: "Server database creation error" });
    }
};

// PUT /api/hydration/:userId
exports.updateHydration = async (req, res) => {
    const { userId } = req.params;
    let { current, customTarget } = req.body;
    try {
        const record = await Hydration.findOne({ userId });
        if (!record) return res.status(404).json({ error: "Record missing" });

        // ⏰ SAFETY GUARD DOG: If the user leaves the tab open past midnight 
        // and clicks "+" without refreshing, force the update to start fresh from 0
        if (isPastDay(record.date)) {
            console.log("Midnight crossover detected during action click. Forcing progressive reset.");
            // If they clicked "+ 250ml", current will come in as 0.25 instead of adding to yesterday's 3.0L
            if (current > 0.25) {
                current = 0.25; 
            }
        }

        const updatedRecord = await Hydration.findOneAndUpdate(
            { userId },
            { 
                $set: { 
                    current, 
                    customTarget,
                    date: new Date() // Always keep the tracking date fresh on updates
                } 
            },
            { returnDocument: 'after' }
        );

        return res.status(200).json(updatedRecord);
    } catch (err) {
        console.error("Error in updateHydration:", err);
        return res.status(500).json({ error: "Server database modification error" });
    }
};