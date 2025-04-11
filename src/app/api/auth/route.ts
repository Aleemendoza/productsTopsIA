import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '../../../utils/pkce';

export async function GET() {
  const code_verifier = generateCodeVerifier();
  const code_challenge = await generateCodeChallenge(code_verifier);

    const url = new URL('https://auth.mercadolibre.com.ar/authorization');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', process.env.ML_CLIENT_ID!);
  url.searchParams.set('redirect_uri', process.env.ML_REDIRECT_URI!);
  url.searchParams.set('code_challenge', code_challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  const res = NextResponse.redirect(url.toString());
  res.cookies.set('ml_code_verifier', code_verifier, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 300, // 5 minutos
  });

  return res;
}

