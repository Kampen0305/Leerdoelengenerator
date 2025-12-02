
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('❌ Missing API Key in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let listData = null;
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        console.log(`[Vercel] Received prompt length: ${prompt.length}`);

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

        console.log('[Vercel] Generated response successfully');
        res.status(200).json({ text });

    } catch (error) {
        console.error('[Vercel] Error generating content:', error);

        // Fallback logic for model not found
        if (error.message?.includes('404') || error.status === 404 || error.message?.includes('not found')) {
            console.log('[Vercel] Model error - attempting to auto-detect available models...');
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
                    console.log(`[Vercel] Falling back to detected model: ${modelName}`);

                    const fallbackModel = genAI.getGenerativeModel({ model: modelName });
                    const fallbackResult = await fallbackModel.generateContent({
                        contents: [{ role: 'user', parts: [{ text: req.body.prompt }] }],
                    });
                    const fallbackResponse = await fallbackResult.response;
                    const fallbackText = fallbackResponse.text();

                    console.log('[Vercel] Fallback successful');
                    return res.status(200).json({ text: fallbackText });
                } else {
                    console.error('[Vercel] No valid Gemini model found in list:', listData);
                }
            } catch (fallbackError) {
                console.error('[Vercel] Fallback failed:', fallbackError);
            }
        }

        res.status(500).json({
            error: 'Failed to generate content',
            details: error.message,
            availableModels: listData
        });
    }
}
