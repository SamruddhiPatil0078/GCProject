const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeAssignment = async (description) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
Analyze the following assignment description and extract:
- Category: (field visit, report, research, coding, presentation, etc.)
- Difficulty: (easy, medium, hard)
- Estimated Hours: (number)
- Priority: (low, medium, high)
- Required Steps: (list of steps)

Assignment: "${description}"

Return in JSON format.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Parse the JSON response
  try {
    return JSON.parse(text);
  } catch (error) {
    // If not JSON, try to extract
    return { category: 'Unknown', difficulty: 'Medium', estimatedHours: 2, priority: 'Medium', requiredSteps: [] };
  }
};

const generatePlan = async (assignments) => {
  // Simple plan generation, can be enhanced with AI
  const plan = assignments.map(assignment => ({
    assignmentId: assignment._id,
    dailyPlan: `Work on ${assignment.title} for ${assignment.estimatedHours} hours.`
  }));
  return plan;
};

module.exports = { analyzeAssignment, generatePlan };