import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { saveToken } from '@/utils/ml-auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const cookieStore = await cookies();
  const code_verifier = cookieStore.get('ml_code_verifier')?.value;

  if (!code || !code_verifier) {
    return NextResponse.json({ error: 'Falta el código o el verifier' }, { status: 400 });
  }

  const res = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ML_CLIENT_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      code,
      code_verifier,
      redirect_uri: process.env.ML_REDIRECT_URI!,
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    return NextResponse.json({ error: 'No se pudo obtener el token', detalle: data }, { status: 401 });
  }

  await saveToken(data);

  return NextResponse.redirect('/');
}
