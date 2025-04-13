import { prisma } from '@/lib/prisma';
import { MercadoLibreTokenData } from '@/types/ml';

export async function loadToken() {
  return await prisma.mercadoLibreToken.findUnique({ where: { id: 1 } });
}

export async function saveToken(data: MercadoLibreTokenData) {
  await prisma.mercadoLibreToken.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
}
export async function refreshAccessToken() {
  const tokenData = await loadToken();

  if (!tokenData?.refresh_token) {
    const res = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client-credenctials',
        client_id: process.env.ML_CLIENT_ID!,
        client_secret: process.env.ML_CLIENT_SECRET!
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
