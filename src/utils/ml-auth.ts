import { prisma } from '@/lib/prisma';
import { MercadoLibreTokenData } from '@/types/ml';

export async function loadToken() {
  return await prisma.mercadoLibreToken.findUnique({ where: { id: 1 } });
}

export async function saveToken(data: MercadoLibreTokenData) {
  await prisma.mercadoLibreToken.upsert({
    where: { id: 1 },
    update: {
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? null,
      token_type: data.token_type,
      expires_in: data.expires_in,
      user_id: data.user_id,
    },
    create: {
      id: 1,
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? null,
      token_type: data.token_type,
      expires_in: data.expires_in,
      user_id: data.user_id,
    },
  });
  
}
export async function refreshAccessToken() {
  const tokenData = await loadToken();

  if (!tokenData?.refresh_token) {
    const res = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.ML_CLIENT_ID!,
        client_secret: process.env.ML_CLIENT_SECRET!
      }),
    });

    const newData = await res.json();
    console.log('newData', newData);

    if (!newData.access_token) {
      throw new Error('No se pudo refrescar el token');
    }

    await saveToken({
      access_token: newData.access_token,
      token_type: newData.token_type,
      expires_in: newData.expires_in,
      refresh_token: newData.refresh_token,
      user_id: newData.user_id,
    });
    return newData;
  }

  const res = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.ML_CLIENT_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      refresh_token: tokenData.refresh_token,
    }),
  });

  const newData = await res.json();
  console.log('newData', newData);

  if (!newData.access_token) {
    throw new Error('No se pudo refrescar el token');
  }

  await saveToken(newData);
  return newData;
}
