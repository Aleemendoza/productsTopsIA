import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { productos } = await request.json();

  const prompt = `
    Analiza la siguiente lista de productos y recomiéndame cuál tiene mayor potencial para revender o promocionar basándote en su popularidad, precio y ventas:

    ${productos.map((p: any, i: number) => `${i + 1}. ${p.title}, Precio: ${p.price}, Vendidos: ${p.sold_quantity}`).join('\n')}

    Justifica brevemente la elección.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  const recommendation = completion.choices[0].message.content;

  return NextResponse.json({ recommendation });
}
