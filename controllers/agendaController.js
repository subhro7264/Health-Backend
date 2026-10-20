// const Agenda = require("../models/Agenda");


// const postAgenda = async (req, res) => {
//     try {

//         const newAgendaItem = new Agenda(req.body);
        
//         const savedItem = await newAgendaItem.save();
    
//         res.status(201).json(savedItem);

//     } catch (error) {
   
//         res.status(400).json({ message: error.message });
//     }
// };





// // const getAgenda = async (req, res) => {

// //     try {
  
// //         const agendaItems = await Agenda.find();
// //         res.status(200).json(agendaItems);

// //     } catch (error) {
  
// //         res.status(500).json({ message: error.message });
// //     }
// // };




// const getAgenda = async (req, res) => {
//     try {
//         // Expects a date string format like "2026-06-17" from the frontend
//         const { dateString } = req.query; 
//         if (!dateString) {
//             return res.status(400).json({ message: "dateString query is required" });
//         }

//         // Create start and end boundaries for the requested day
//         const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
//         const endOfDay = new Date(`${dateString}T23:59:59.999Z`);

//         // Find tasks created within that specific 24-hour window
//         let agendaItems = await Agenda.find({
//             createdAt: { $gte: startOfDay, $lte: endOfDay }
//         });

//         // 🔥 AUTOMATIC ROLLING CONFIGURATION:
//         // If it's today, and you haven't populated any tasks yet, clone your routine from yesterday
//         const todayStr = new Date().toISOString().split('T')[0];
//         if (agendaItems.length === 0 && dateString === todayStr) {
            
//             // Fetch the most recent tasks saved in your historical database entries
//             const previousTasks = await Agenda.find().sort({ createdAt: -1 }).limit(15);
            
//             if (previousTasks.length > 0) {
//                 // Filter out unique task names to prevent duplicate clones
//                 const uniqueTaskNames = [...new Set(previousTasks.map(item => item.task))];
                
//                 // Map them into brand new objects for today (resetting completed to false)
//                 const newDayTasks = uniqueTaskNames.map(taskName => ({
//                     task: taskName,
//                     completed: false
//                 }));

//                 // Batch insert them into MongoDB with today's automated timestamps
//                 agendaItems = await Agenda.insertMany(newDayTasks);
//             }
//         }

//         res.status(200).json(agendaItems);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const deleteAgenda = async (req, res) => {
//     try {
//         // 1. Grab the ID from the URL parameters (e.g., /api/agenda/60d5ec...)
//         const { id } = req.params;

//         // 2. Find the item by its ID and remove it from MongoDB
//         const deletedItem = await Agenda.findByIdAndDelete(id);

//         // 3. If no item matches that ID, return a 404 Not Found error
//         if (!deletedItem) {
//             return res.status(404).json({ message: "Agenda item not found" });
//         }

//         // 4. Return a success response alongside the deleted item data
//         res.status(200).json({ 
//             message: "Agenda item deleted successfully", 
//             deletedItem 
//         });

//     } catch (error) {
        
//         res.status(500).json({ message: error.message });
//     }
// }



// // PUT: Toggle task completion status
// const toggleAgenda = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { completed } = req.body;

//         // Update the item and return the freshly updated document ({ new: true })
//         const updatedItem = await Agenda.findByIdAndUpdate(
//             id, 
//             { completed }, 
//            { returnDocument: 'after' }
//         );

//         if (!updatedItem) {
//             return res.status(404).json({ message: "Agenda item not found" });
//         }

//         res.status(200).json(updatedItem);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// module.exports = { postAgenda, getAgenda,deleteAgenda,toggleAgenda};












// const Agenda = require("../models/Agenda");

// // POST: Save agenda item bound to req.user._id
// const postAgenda = async (req, res) => {
//     try {
//         const newAgendaItem = new Agenda({
//             ...req.body,
//             user: req.user._id, // Attach active user
//         });
        
//         const savedItem = await newAgendaItem.save();
//         res.status(201).json(savedItem);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // GET: Retrieve only this user's items for the given date
// const getAgenda = async (req, res) => {
//     try {
//         const { dateString } = req.query; 
//         if (!dateString) {
//             return res.status(400).json({ message: "dateString query is required" });
//         }

//         const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
//         const endOfDay = new Date(`${dateString}T23:59:59.999Z`);

//         // Query filtered by user AND date window
//         let agendaItems = await Agenda.find({
//             user: req.user._id,
//             createdAt: { $gte: startOfDay, $lte: endOfDay }
//         });

//         // AUTOMATIC ROLLING CONFIGURATION FOR THIS USER ONLY
//         const todayStr = new Date().toISOString().split('T')[0];
//         if (agendaItems.length === 0 && dateString === todayStr) {
            
//             // Only fetch this user's recent previous tasks
//             const previousTasks = await Agenda.find({ user: req.user._id })
//                 .sort({ createdAt: -1 })
//                 .limit(15);
            
//             if (previousTasks.length > 0) {
//                 const uniqueTaskNames = [...new Set(previousTasks.map(item => item.task))];
                
//                 // Attach user ID to cloned tasks
//                 const newDayTasks = uniqueTaskNames.map(taskName => ({
//                     task: taskName,
//                     completed: false,
//                     user: req.user._id,
//                 }));

//                 agendaItems = await Agenda.insertMany(newDayTasks);
//             }
//         }

//         res.status(200).json(agendaItems);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // DELETE: Ensure the item belongs to req.user._id before deleting
// const deleteAgenda = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deletedItem = await Agenda.findOneAndDelete({
//             _id: id,
//             user: req.user._id, // User ownership guard
//         });

//         if (!deletedItem) {
//             return res.status(404).json({ message: "Agenda item not found or unauthorized" });
//         }

//         res.status(200).json({ 
//             message: "Agenda item deleted successfully", 
//             deletedItem 
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // PUT: Toggle status only if item belongs to req.user._id
// const toggleAgenda = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { completed } = req.body;

//         const updatedItem = await Agenda.findOneAndUpdate(
//             { _id: id, user: req.user._id }, // User ownership guard
//             { completed }, 
//             { returnDocument: 'after' }
//         );

//         if (!updatedItem) {
//             return res.status(404).json({ message: "Agenda item not found or unauthorized" });
//         }

//         res.status(200).json(updatedItem);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = { postAgenda, getAgenda, deleteAgenda, toggleAgenda };







const Agenda = require("../models/Agenda");

// Helper to get start and end of day based on a YYYY-MM-DD string in local/server time
const getDateRange = (dateString) => {
    const start = new Date(`${dateString}00:00:00`);
    const end = new Date(`${dateString}23:59:59.999`);
    return { start, end };
};

// POST: Save agenda item bound to req.user._id
const postAgenda = async (req, res) => {
    try {
        const newAgendaItem = new Agenda({
            ...req.body,
            user: req.user._id, // Attach active user
        });
        
        const savedItem = await newAgendaItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET: Retrieve only this user's items for the given date
const getAgenda = async (req, res) => {
    try {
        const { dateString } = req.query; 
        if (!dateString) {
            return res.status(400).json({ message: "dateString query is required" });
        }

        const startOfDay = new Date(`${dateString}T00:00:00.000`);
        const endOfDay = new Date(`${dateString}T23:59:59.999`);

        // Query filtered by user AND date window
        let agendaItems = await Agenda.find({
            user: req.user._id,
            createdAt: { $gte: startOfDay,$lte: endOfDay }
        }).sort({ createdAt: 1 });

        // AUTOMATIC ROLLING CONFIGURATION FOR THIS USER ONLY
        const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local format
        if (agendaItems.length === 0 && dateString === todayStr) {
            
            // Find unique tasks from the most recent previous day that had tasks
            const previousTasks = await Agenda.find({ 
                user: req.user._id,
                createdAt: { $lt: startOfDay }
            })
                .sort({ createdAt: -1 })
                .limit(20);
            
            if (previousTasks.length > 0) {
                // Get unique task names from the latest active day
                const latestDateString = previousTasks[0].createdAt.toISOString().split('T')[0];
                const latestDayTasks = previousTasks.filter(item => 
                    item.createdAt.toISOString().split('T')[0] === latestDateString
                );
                
                const uniqueTaskNames = [...new Set(latestDayTasks.map(item => item.task))];
                
                // Attach user ID and today's timestamp to cloned tasks
                const newDayTasks = uniqueTaskNames.map(taskName => ({
                    task: taskName,
                    completed: false,
                    user: req.user._id,
                    createdAt: new Date(), // Stamped for today
                }));

                if (newDayTasks.length > 0) {
                    agendaItems = await Agenda.insertMany(newDayTasks);
                }
            }
        }

        res.status(200).json(agendaItems);
    } catch (error) {
        console.error("Error in getAgenda:", error);
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Ensure the item belongs to req.user._id before deleting
const deleteAgenda = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await Agenda.findOneAndDelete({
            _id: id,
            user: req.user._id, // User ownership guard
        });

        if (!deletedItem) {
            return res.status(404).json({ message: "Agenda item not found or unauthorized" });
        }

        res.status(200).json({ 
            message: "Agenda item deleted successfully", 
            deletedItem 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Toggle status only if item belongs to req.user._id
const toggleAgenda = async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        const updatedItem = await Agenda.findOneAndUpdate(
            { _id: id, user: req.user._id }, // User ownership guard
            { completed }, 
            { returnDocument: 'after' }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Agenda item not found or unauthorized" });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { postAgenda, getAgenda, deleteAgenda, toggleAgenda };