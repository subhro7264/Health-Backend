// const { GoogleGenAI, Type } = require('@google/genai');
// const Diet = require('../models/Diet');

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // GET: Retrieve the logged-in user's latest diet plan
// const getLatestDietPlan = async (req, res) => {
//   try {
//     const plan = await Diet.findOne({ user: req.user._id }).sort({ createdAt: -1 });
//     return res.status(200).json({ success: true, plan });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// // POST: Generate a new plan via Gemini & save it for req.user._id
// const generateDietPlan = async (req, res) => {
//   try {
//     const { calories, dietType, goal, restrictions } = req.body;

//     const prompt = `
//       Act as an expert sports dietitian.
//       Generate a realistic, balanced 1-day meal plan for a user with these specs:
//       - Daily Target: ${calories || 2000} kcal
//       - Dietary Preference: ${dietType || 'Balanced'}
//       - Fitness Goal: ${goal || 'Healthy Living'}
//       - Allergies/Restrictions: ${restrictions || 'None'}
//     `;

//     const response = await ai.models.generateContent({
//       model: 'gemini-3.6-flash',
//       contents: prompt,
//       config: {
//         responseMimeType: 'application/json',
//         responseSchema: {
//           type: Type.OBJECT,
//           properties: {
//             totalCalories: { type: Type.NUMBER },
//             macros: {
//               type: Type.OBJECT,
//               properties: {
//                 protein: { type: Type.STRING },
//                 carbs: { type: Type.STRING },
//                 fats: { type: Type.STRING }
//               },
//               required: ['protein', 'carbs', 'fats']
//             },
//             meals: {
//               type: Type.ARRAY,
//               items: {
//                 type: Type.OBJECT,
//                 properties: {
//                   meal: { type: Type.STRING },
//                   title: { type: Type.STRING },
//                   calories: { type: Type.NUMBER },
//                   description: { type: Type.STRING }
//                 },
//                 required: ['meal', 'title', 'calories', 'description']
//               }
//             },
//             nutritionTip: { type: Type.STRING }
//           },
//           required: ['totalCalories', 'macros', 'meals', 'nutritionTip']
//         }
//       },
//     });

//     const parsedPlan = JSON.parse(response.text);

//     // Save or update user's plan in DB
//     const savedPlan = await Diet.findOneAndUpdate(
//       { user: req.user._id },
//       { ...parsedPlan, user: req.user._id },
//       { new: true, upsert: true, returnDocument: 'after' }
//     );

//     return res.status(200).json({ success: true, plan: savedPlan });
//   } catch (error) {
//     console.error('Diet Generation Error:', error);
//     return res.status(500).json({ 
//       success: false, 
//       message: error.message || 'Failed to generate meal plan' 
//     });
//   }
// };

// module.exports = { getLatestDietPlan, generateDietPlan };


const { GoogleGenAI, Type } = require('@google/genai');
const Diet = require('../models/Diet');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// GET: Retrieve the logged-in user's latest diet plan
const getLatestDietPlan = async (req, res) => {
  try {
    const plan = await Diet.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST: Generate a new plan via Gemini & save it for req.user._id
const generateDietPlan = async (req, res) => {
  try {
    const { prompt: userPrompt, calories, dietType, goal, restrictions } = req.body;

    // Construct prompt allowing either a direct text prompt, structured form inputs, or both
    let finalPrompt = '';

    if (userPrompt && !calories && !dietType) {
      // Case 1: The user provided a free-form custom prompt
      finalPrompt = `
        Act as an expert sports dietitian.
        Generate a realistic, balanced 1-day meal plan based on this user request:
        "${userPrompt}"
      `;
    } else {
      // Case 2: Structured inputs with an optional custom prompt/instructions attached
      finalPrompt = `
        Act as an expert sports dietitian.
        Generate a realistic, balanced 1-day meal plan for a user with these specifications:
        - Daily Caloric Target: ${calories || 2000} kcal
        - Dietary Preference: ${dietType || 'Balanced'}
        - Fitness Goal: ${goal || 'Healthy Living'}
        - Allergies / Restrictions: ${restrictions || 'None'}
        ${userPrompt ? `- Additional Instructions / Preferences: "${userPrompt}"` : ''}
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: finalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalCalories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.STRING },
                carbs: { type: Type.STRING },
                fats: { type: Type.STRING },
              },
              required: ['protein', 'carbs', 'fats'],
            },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  meal: { type: Type.STRING },
                  title: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                },
                required: ['meal', 'title', 'calories', 'description'],
              },
            },
            nutritionTip: { type: Type.STRING },
          },
          required: ['totalCalories', 'macros', 'meals', 'nutritionTip'],
        },
      },
    });

    const parsedPlan = JSON.parse(response.text);

    // Save or update the user's latest plan in MongoDB
    const savedPlan = await Diet.findOneAndUpdate(
      { user: req.user._id },
      { ...parsedPlan, user: req.user._id },
      { new: true, upsert: true, returnDocument: 'after' }
    );

    return res.status(200).json({ success: true, plan: savedPlan });
  } catch (error) {
    console.error('Diet Generation Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate meal plan',
    });
  }
};

module.exports = { getLatestDietPlan, generateDietPlan };