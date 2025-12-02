import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('❌ Missing API Key in .env file (VITE_GEMINI_API_KEY)');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/api/gemini', async (req, res) => {
    let listData = null; // Store list data for error reporting
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        console.log(`[Server] Received prompt length: ${prompt.length}`);

        // Use the standard model
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
            },
        });

        const response = await result.response;
        const text = response.text();

        console.log('[Server] Generated response successfully');
        res.json({ text });

    } catch (error) {
        console.error('[Server] Error generating content:', error);

        // Fallback logic for model not found
        if (error.message?.includes('404') || error.status === 404 || error.message?.includes('not found')) {
            console.log('[Server] Model error - attempting to auto-detect available models...');
            try {
                const listResp = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
                listData = listResp.data;

                // Find a model that supports generateContent and is a gemini model
                const validModel = listData.models?.find((m) =>
                    m.name.includes('gemini') &&
                    m.supportedGenerationMethods?.includes('generateContent')
                );

                if (validModel) {
                    const modelName = validModel.name.replace('models/', '');
                    console.log(`[Server] Falling back to detected model: ${modelName}`);

                    const fallbackModel = genAI.getGenerativeModel({ model: modelName });
                    const fallbackResult = await fallbackModel.generateContent({
                        contents: [{ role: 'user', parts: [{ text: req.body.prompt }] }],
                    });
                    const fallbackResponse = await fallbackResult.response;
                    const fallbackText = fallbackResponse.text();

                    console.log('[Server] Fallback successful');
                    return res.json({ text: fallbackText });
                } else {
                    console.error('[Server] No valid Gemini model found in list:', listData);
                }
            } catch (fallbackError) {
                console.error('[Server] Fallback failed:', fallbackError);
            }
        }

        res.status(500).json({
            error: 'Failed to generate content',
            details: error.message,
            availableModels: listData // Include the list of models if we fetched them
        });
    }
});

app.listen(port, () => {
    console.log(`
🚀 Server running at http://localhost:${port}
🔑 API Key present: ${!!API_KEY}
  `);
});
