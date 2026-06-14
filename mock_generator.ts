import { QuestionSchema } from './schema';

const mockLLMResponse = `
{
  "id": "gd_e1",
  "category": "Software Engineering",
  "subcategory": "Unity",
  "difficulty": "EASY",
  "question": "Which programming language is primarily used in Unity?",
  "options": ["C++", "Java", "C#", "Python"],
  "correctAnswer": "C#",
  "explanation": "Unity uses C# as its primary scripting language.",
  "tags": ["unity", "programming"],
  "questionType": "MCQ",
  "sourceType": "generated"
}
`;

async function generateMockQuestion() {
  try {
    console.log("Generating mock question...");
    
    const rawData = JSON.parse(mockLLMResponse);
    
    const validatedQuestion = QuestionSchema.parse(rawData);
    
    console.log("Validation Successful!");
    console.log("Question Object:", validatedQuestion);
    
    return validatedQuestion;
  } catch (error) {
    console.error("Validation Failed:", error);
  }
}

generateMockQuestion();