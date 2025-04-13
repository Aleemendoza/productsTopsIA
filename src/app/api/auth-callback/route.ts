
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { saveToken } from '@/utils/ml-auth';
import {  generateCodeVerifier } from '@/utils/pkce';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  const code_verifier = generateCodeVerifier();
  // const code_challenge = await generateCodeChallenge(code_verifier);
  // console.lo
  if (!code || !code_verifier) {
    return NextResponse.json({ error: 'Falta el código o el code_verifier' }, { status: 400 });
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
      code_verifier: code_verifier,
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    console.error('Error al obtener el token:', data);
    return NextResponse.json({ error: 'No se pudo obtener el token' }, { status: 500 });
  }

  await saveToken(data);

  const response = NextResponse.redirect('/');
  response.cookies.set('access_token', data.access_token, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return response;
}
