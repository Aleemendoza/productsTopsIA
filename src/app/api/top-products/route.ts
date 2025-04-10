import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get('category') || 'MLA1055';

  const res = await fetch(
    `https://api.mercadolibre.com/sites/MLA/search?category=${category}&sort=sold_quantity_desc&limit=10`
  );

  const data = await res.json();

  return NextResponse.json({ productos: data.results });
}
