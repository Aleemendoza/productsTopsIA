"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sold_quantity: number;
  permalink: string;
}

export default function TopProductsPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // const [recomendacion, setRecomendacion] = useState<string>('');
  const [loadingIA, setLoadingIA] = useState(false);

  useEffect(() => {
    fetch('/api/top-products?category=MLA1055')
      .then(res => res.json())
      .then(data => {
        setProductos(data.productos);
        setLoading(false);
      });
  }, []);

  const pedirRecomendacion = async () => {
    // setLoadingIA(true);
    // const res = await fetch('/api/recommend', {
    //   method: 'POST',
    //   body: JSON.stringify({ productos }),
    //   headers: { 'Content-Type': 'application/json' },
    // });

    // const data = await res.json();
    // setRecomendacion(data.recommendation);
    setLoadingIA(false);
    console.log('recomendaciones de la IA!')
  };

  if (loading)
    return (
      <p className="text-center text-xl font-bold mt-10">⏳ Cargando productos...</p>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-5">🔥 Productos más vendidos</h1>

      <button
        onClick={pedirRecomendacion}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md my-5 transition"
        disabled={loadingIA}
      >
        {loadingIA ? "⏳ Analizando..." : "🧠 Pedir recomendación IA"}
      </button>

      {/* {recomendacion && (
        <div className="bg-green-100 p-4 rounded-md shadow mb-5">
          <h2 className="font-bold text-green-700 mb-2">Recomendación IA:</h2>
          <p>{recomendacion}</p>
        </div>
      )} */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map(prod => (
          <a
            key={prod.id}
            href={prod.permalink}
            target="_blank"
            className="bg-white rounded shadow p-4 hover:shadow-lg transition"
          >
            <Image
              src={prod.thumbnail.replace('http://', 'https://')}
              alt={prod.title}
              width={300}
              height={300}
              className="rounded w-full h-auto"
            />
            <h2 className="font-semibold text-lg mt-2">{prod.title}</h2>
            <p className="text-xl font-bold">
              ${prod.price.toLocaleString('es-AR')}
            </p>
            <p className="text-sm text-gray-500">
              Vendidos: {prod.sold_quantity}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
