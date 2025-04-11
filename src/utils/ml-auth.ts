import { prisma } from '@/lib/prisma';
import { MercadoLibreTokenData } from '@/types/ml';

export async function saveToken(data: MercadoLibreTokenData) {
  await prisma.mercadoLibreToken.upsert({
    where: { id: 1 },
    update: {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
      user_id: data.user_id,
    },
    create: {
      id: 1,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
      user_id: data.user_id,
    },
  });
}

export async function loadToken() {
  const data = await prisma.mercadoLibreToken.findUnique({ where: { id: 1 } });
  console.log('este es el token', data?.access_token)
  return data;
}

export async function refreshAccessToken() {
  const tokenData = await loadToken();

  if (!tokenData?.access_token) {
    throw new Error('No refresh_token disponible');
  }

  const res = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.ML_CLIENT_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      refresh_token: tokenData.access_token,
    }),
  });

  const newData = await res.json();

  if (newData.access_token) {
    await saveToken(newData);
    return newData;
  } else {
    throw new Error('No se pudo refrescar el token');
  }
}
