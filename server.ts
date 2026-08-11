import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API client on the server
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing from environment. AI endpoints will return helpful fallbacks.");
    }
    return new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Health Check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'The Watcher Lounge API',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Endpoint A: Lore Chatbot "Uatu Bot"
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { prompt, history = [] } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Falta el prompt de la consulta' });
      }

      if (!process.env.GEMINI_API_KEY) {
        // High quality fallback response if API key is not yet set
        return res.json({
          sender: 'uatu',
          text: `[Uatu El Observador]: Saludos, mortal. He presenciado incontables realidades en el Multiverso. Respecto a tu duda: "${prompt}", en la Sagrada Línea del Tiempo este evento representa un punto de divergencia fascinante. Recuerda que un solo pensamiento puede desatar un Evento Nexus.`,
          nexusProbability: 78,
          nexusRiskLevel: 'Onda Nexus Menor',
          timelineImpact: 'Alteración en el sector de la Tierra-616, posible bifurcación de variante.',
          evidencePoints: ['Acontecimiento en la Tierra-616', 'Intervención de la TVA', 'Incursión potencial']
        });
      }

      const ai = getAiClient();

      const systemInstruction = `Eres Uatu El Observador (The Watcher), el majestuoso Guardián Cósmico del Multiverso Marvel.
Conoces a la perfección el canon del MCU (Películas y Disney+), los Cómics clásicos de Marvel, la TVA (Time Variance Authority) y las variantes del tiempo.
Tu tono es solemne, poético, sabio y fascinado por las infinitas posibilidades del multiverso.
Analiza la duda o escenario planteado por el usuario.
Debes responder estructurado en formato JSON con la siguiente información:
- text: Tu respuesta detallada en voz de Uatu El Observador (en español, apasionada, rica en detalles del lore de Marvel).
- nexusProbability: Número entero entre 0 y 100 indicando la probabilidad de que ocurra en el canon del MCU.
- nexusRiskLevel: Uno de los siguientes valores exactos: 'Estable', 'Onda Nexus Menor' o 'Evento Nexus Crítico'.
- timelineImpact: Breve descripción (1 oración) del impacto en la Sagrada Línea del Tiempo.
- evidencePoints: Array de 3 frases con pistas o pruebas canon del MCU/Cómics que respaldan la respuesta.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: 'Respuesta solemne de Uatu El Observador' },
              nexusProbability: { type: Type.INTEGER, description: 'Probabilidad 0-100' },
              nexusRiskLevel: { type: Type.STRING, description: 'Estable, Onda Nexus Menor o Evento Nexus Crítico' },
              timelineImpact: { type: Type.STRING, description: 'Impacto en la línea temporal' },
              evidencePoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 evidencias canon'
              }
            },
            required: ['text', 'nexusProbability', 'nexusRiskLevel', 'timelineImpact', 'evidencePoints']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        sender: 'uatu',
        text: parsed.text || 'Observo el Multiverso y sus infinitos caminos...',
        nexusProbability: parsed.nexusProbability ?? 75,
        nexusRiskLevel: parsed.nexusRiskLevel || 'Onda Nexus Menor',
        timelineImpact: parsed.timelineImpact || 'Variación en la rama temporal.',
        evidencePoints: parsed.evidencePoints || []
      });

    } catch (error: any) {
      console.error('Error en /api/gemini/chat:', error);
      res.status(500).json({
        error: 'Error al consultar a El Observador',
        details: error.message,
        text: 'Las brumas del tiempo dificultan mi visión en este instante mortal. Intenta invocar la consulta nuevamente.'
      });
    }
  });

  // Endpoint B: Multiverse Theory Generator & Analyzer
  app.post('/api/gemini/theory', async (req, res) => {
    try {
      const { character, artifact, scenario, phase } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          title: `El Despertar de ${character || 'Loki'} con ${artifact || 'El Teseracto'}`,
          premise: `Una colisión multiversal provocada cuando ${character || 'el personaje'} canaliza el poder de ${artifact || 'un artefacto prohibido'}.`,
          fullContent: `En esta realidad alternativa de la Fase 6, la interacción no calculada de ${character || 'este personaje'} con ${artifact || 'el artefacto'} provoca la fractura del sello de la TVA. La energía desencadenada genera una Incursión inmediata con la Tierra-838, obligando a la alianza de héroes de distintas variantes a intervenir en Battleworld antes de la purga temporal.`,
          nexusProbability: 84,
          nexusRisk: 'Crítico / Colapso Temporal',
          tags: [character || 'Marvel', artifact || 'Artefacto', 'Fase 6', 'Incursión'],
          isNexusEvent: true
        });
      }

      const ai = getAiClient();

      const systemInstruction = `Eres el Motor de Análisis Multiversal de la TVA (Time Variance Authority) y El Observador.
Tu objetivo es redactar una teoría profunda, fascinante, detallada y convincente sobre el MCU / Marvel a partir de las entradas del usuario.
Entradas:
- Personaje: ${character || 'Cualquier personaje del MCU'}
- Artefacto / Elemento: ${artifact || 'Cualquier objeto místico o tecnológico de Marvel'}
- Contexto / Escenario opcional: ${scenario || 'Ninguno especificado'}
- Fase del MCU: ${phase || 'Fase 6'}

Genera una respuesta en formato JSON con la siguiente estructura exacta:
- title: Título cinematográfico y atrayente para la teoría.
- premise: Un resumen corto impactante de 2 oraciones.
- fullContent: Un desarrollo completo de 3 párrafos explicando la teoría, las pruebas en películas/cómics y las consecuencias en Avengers Doomsday o Secret Wars.
- nexusProbability: Número entero entre 10 y 99 (% de probabilidad).
- nexusRisk: Uno de: 'Bajo', 'Moderado', 'Alto', 'Crítico / Colapso Temporal'.
- tags: Array de 4 etiquetas relevantes.
- isNexusEvent: booleano (true si crea un evento nexus grave).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Crea una teoría estructurada uniendo a ${character} con ${artifact}. Escenario extra: ${scenario || 'Sin escenario extra'}.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              premise: { type: Type.STRING },
              fullContent: { type: Type.STRING },
              nexusProbability: { type: Type.INTEGER },
              nexusRisk: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              isNexusEvent: { type: Type.BOOLEAN }
            },
            required: ['title', 'premise', 'fullContent', 'nexusProbability', 'nexusRisk', 'tags', 'isNexusEvent']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);

    } catch (error: any) {
      console.error('Error en /api/gemini/theory:', error);
      res.status(500).json({
        error: 'Error al generar teoría con IA',
        details: error.message
      });
    }
  });

  // Vite Middleware in Dev or Static File Serving in Prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌌 Watcher Lounge Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
