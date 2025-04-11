import { NextResponse } from 'next/server';
// import { saveToken } from '@/utils/ml-auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const cookieHeader = request.headers.get('cookie') || '';
  const code_verifier = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('ml_code_verifier='))
    ?.split('=')[1];
  
  if (!code || !code_verifier) {
    return NextResponse.json({ error: 'Falta el código o el verifier' }, { status: 400 });
  }

  const res = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: '7107839417335648',
      client_secret: '5rn10lsU5JUVhSWfm51zSSso3at15DxQ',
      code,
      code_verifier,
      redirect_uri: 'https://products-tops-ia.vercel.app/api/auth-callback',
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    return NextResponse.json({ error: 'No se pudo obtener el token', detalle: data }, { status: 401 });
  }

  // await saveToken(data);

  return NextResponse.redirect('/');
}
