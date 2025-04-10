import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://api.mercadolibre.com/sites/MLA/categories');
  const categories = await res.json();

  return NextResponse.json({ categories });
}
