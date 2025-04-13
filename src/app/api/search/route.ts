import { NextResponse } from 'next/server';
import { loadToken, refreshAccessToken } from '@/utils/ml-auth';

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sold_quantity: number;
  permalink: string;
  category: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const q = url.searchParams.get('q')?.toLowerCase() || '';
    const limit = Number(url.searchParams.get('limit')) || 200;

    // // ✅ MODO DESARROLLO — usar JSON local
    // // if (process.env.NODE_ENV !== 'production') {
    //   const filePath = path.join(process.cwd(), 'src/products_mock.json');
    //   const fileData = await fs.readFile(filePath, 'utf-8');
    //   const allProducts: Product[] = JSON.parse(fileData);

    //   let filtered = allProducts;

    //   if (category) {
    //     filtered = filtered.filter(prod => prod.category === category);
    //   }

    //   if (q) {
    //     filtered = filtered.filter(prod =>
    //       prod.title.toLowerCase().includes(q)
    //     );
    //   }

    //   const productos = filtered.slice(0, limit);
    //   return NextResponse.json({ productos });
    // }

    // ✅ MODO PRODUCCIÓN — usar API real de ML
    let tokenData = await loadToken();
    if (!tokenData?.access_token) tokenData = await refreshAccessToken();
    if (!tokenData?.access_token) {
      return NextResponse.json(
        { error: 'Token de acceso no disponible ni se pudo refrescar' },
        { status: 401 }
      );
    }

    let apiUrl = `https://api.mercadolibre.com/sites/MLA/search?limit=${limit}&sort=sold_quantity_desc`;
    if (category) apiUrl += `&category=${category}`;
    if (q) apiUrl += `&q=${encodeURIComponent(q)}`;

    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
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
    const productos: Product[] = data.results?.map((prod: Product) => ({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      thumbnail: prod.thumbnail.replace('http://', 'https://'),
      sold_quantity: prod.sold_quantity,
      permalink: prod.permalink,
      category: category || 'General'
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
