"use client";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [authUrl, setAuthUrl] = useState("");

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_ML_CLIENT_ID!;
    const redirectUri = process.env.NEXT_PUBLIC_ML_REDIRECT_URI!;
    const state = crypto.randomUUID();
    const codeVerifier = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem("ml_code_verifier", codeVerifier);

    const url = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&code_challenge=${codeVerifier}&code_challenge_method=plain`;

    setAuthUrl(url);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        🛒 Bienvenido a Product Tops IA
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
        Descubrí qué productos tienen más demanda y son ideales para vender con bajo riesgo. Nuestra inteligencia artificial te guía para tomar mejores decisiones en ecommerce.
      </p>
      <a
        href={authUrl}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Ingresar con Mercado Libre
      </a>
    </div>
  );
}
