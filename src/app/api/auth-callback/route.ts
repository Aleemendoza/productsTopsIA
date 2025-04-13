
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { saveToken } from '@/utils/ml-auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Falta el código ' }, { status: 400 });
  }

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

  if (!data.access_token || !data.refresh_token) {
    console.error('Error al obtener el token:', data);
    return NextResponse.json({ error: 'No se pudo obtener el token' }, { status: 500 });
  }

  await saveToken(data);

  return NextResponse.redirect(new URL('/', req.url));
}
