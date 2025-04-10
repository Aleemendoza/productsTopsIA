import { loadToken, refreshAccessToken } from '@/utils/ml-auth';
import { NextResponse } from 'next/server';

async function getAccessToken(): Promise<string | null> {
  let tokenData = await loadToken();

  if (!tokenData || !tokenData.access_token) {
    try {
      tokenData = await refreshAccessToken();
    } catch (e) {
      console.error('Error al refrescar el token:', e);
      return null;
    }
  }

  return tokenData?.access_token ?? null;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sold_quantity: number;
  permalink: string;
}

interface MercadoLibreApiProduct {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sold_quantity: number;
  permalink: string;
}

export async function GET(request: Request) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acceso no disponible ni se pudo refrescar' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const q = url.searchParams.get('q') || '';
    const limit = 10;

    let apiUrl = `https://api.mercadolibre.com/sites/MLA/search?limit=${limit}&sort=sold_quantity_desc`;

    if (category) apiUrl += `&category=${category}`;
    if (q) apiUrl += `&q=${encodeURIComponent(q)}`;

    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: 'Error en la API de MercadoLibre', detalle: err },
        { status: res.status }
      );
    }

    const data = await res.json();

    const productos: Product[] = (data.results as MercadoLibreApiProduct[])?.map((prod) => ({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      thumbnail: prod.thumbnail.replace('http://', 'https://'),
      sold_quantity: prod.sold_quantity,
      permalink: prod.permalink,
    })) ?? [];
    return NextResponse.json({ productos });
  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
