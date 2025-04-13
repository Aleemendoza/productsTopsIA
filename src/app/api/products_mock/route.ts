import { NextResponse } from 'next/server';
import products from '../../../products_mock.json';

export async function GET() {
  const agrupados: Record<string, typeof products> = {};

  products.forEach((prod) => {
    if (!agrupados[prod.category]) agrupados[prod.category] = [];
    agrupados[prod.category].push(prod);
  });

  return NextResponse.json(agrupados);
}
