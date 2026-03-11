import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      'Error: GEMINI_API_KEY not found in .env file or environment variables.',
    );
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    console.log('\nAvailable Gemini Models (supporting generateContent):');
    console.log('===================================================');
    if (data.models && Array.isArray(data.models)) {
      data.models.forEach((model: any) => {
        if (
          model.supportedGenerationMethods &&
          model.supportedGenerationMethods.includes('generateContent')
        ) {
          console.log(`Model Name: ${model.name.replace('models/', '')}`); // This is what you put in the code
          console.log(`Description: ${model.description}`);
          console.log('---------------------------------------------------');
        }
      });
    } else {
      console.log('No models found or unexpected format.');
    }
  } catch (error: any) {
    console.error('Failed to fetch models:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

listModels();
