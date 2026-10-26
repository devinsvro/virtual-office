import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const port = Number(process.env.PORT) || 3000;

// Gemini AI analysis proxy endpoint
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { agentRole, recordsSlice } = req.body;

    if (!apiKey) {
      return res.status(200).json({
        available: false,
        message: 'No GEMINI_API_KEY configured. Fallback to high-precision local clinical engine.'
      });
    }

    const ai = new GoogleGenAI();
    const prompt = `You are a specialized healthcare AI agent: ${agentRole}.
Analyze the following patient feedback/encounter records and provide clinical triage insights adhering to hospital quality standards:
${JSON.stringify(recordsSlice, null, 2)}
Respond in valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return res.status(200).json({
      available: true,
      text: response.text
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(200).json({
      available: false,
      error: error.message,
      message: 'Switched to deterministic clinical engine.'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ClinicaAI Virtual Office server running on http://0.0.0.0:${port}`);
  });
}

startServer();
