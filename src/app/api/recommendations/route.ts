// src/app/api/recommendations/route.ts

import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sold_quantity: number;
  permalink: string;
  category: string;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/products_mock.json');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const allProducts: Product[] = JSON.parse(fileContents);

    // Agrupar productos por categoría
    const grouped: Record<string, Product[]> = {};
    for (const product of allProducts) {
      if (!grouped[product.category]) grouped[product.category] = [];
      grouped[product.category].push(product);
    }

    // Calcular recomendación (mejor relación vendidos/precio)
    const recomendaciones = Object.entries(grouped).map(([categoria, products]) => {
      const ordenados = products.sort((a, b) => {
        const scoreA = a.sold_quantity / a.price;
        const scoreB = b.sold_quantity / b.price;
        return scoreB - scoreA;
      });
      return {
        categoria,
        recomendado: ordenados[0],
      };
    });

    return NextResponse.json({ recomendaciones });
  } catch (error) {
    console.error('Error generando recomendaciones:', error);
    return NextResponse.json(
      { error: 'No se pudieron obtener recomendaciones' },
      { status: 500 }
    );
  }
}
