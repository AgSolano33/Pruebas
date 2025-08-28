import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const diagnosticoIA = await openai.chat.completions.create({
  model: "gpt-4o",
  assistant: "asst_Ub4nFcGXTYDi02anozSQFCo4", // tu asistente
  messages: [
    { role: "user", content: JSON.stringify(data) }, // aquí pasas tu información
  ],
}).then(res => JSON.parse(res.choices[0].message.content));
