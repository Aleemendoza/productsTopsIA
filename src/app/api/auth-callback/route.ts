import { NextResponse } from 'next/server';
import { saveToken } from '@/utils/ml-auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No se recibió código de autorización' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.ML_CLIENT_ID!,
        client_secret: process.env.ML_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI!,
      }),
    });

    const data = await res.json();

    if (!data.access_token) {
      return NextResponse.json({ error: 'No se pudo obtener el token', detalle: data }, { status: 401 });
    }

    await saveToken(data);

    return NextResponse.json({
      message: '✅ Token guardado correctamente en la base de datos.',
      user_id: data.user_id,
    });
  } catch (err) {
    console.error('Error al guardar token:', err);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
