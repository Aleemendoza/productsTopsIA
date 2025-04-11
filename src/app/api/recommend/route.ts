import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

export interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sold_quantity: number;
  permalink: string;
}

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: Request) {
  try {
    // const { productos }: { productos: Product[] } = await request.json();

    // const prompt = `
    //   Analiza la siguiente lista de productos y recomiéndame cuál tiene mayor potencial para revender o promocionar basándote en su popularidad, precio y ventas:

    //   ${productos.map((p, i) => `${i + 1}. ${p.title}, Precio: ${p.price}, Vendidos: ${p.sold_quantity}`).join('\n')}

    //   Justifica brevemente la elección.
    // `;

    // const completion = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: prompt }],
    //   max_tokens: 200,
    // });

    // const recommendation = completion.choices[0].message.content;
    console.log('Request en /api/recommend:', request);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error en /api/recommend:', error);
    return NextResponse.json({ error: 'Error interno en recomendación' }, { status: 500 });
  }
}
