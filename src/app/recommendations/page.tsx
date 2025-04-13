"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sold_quantity: number;
  permalink: string;
  category: string;
}

interface Recommendation {
  categoria: string;
  recomendado: Product;
}

type SortKey = "title" | "price" | "sold_quantity";
type SortDirection = "asc" | "desc";

export default function RecommendationsPage() {
  const [recomendaciones, setRecomendaciones] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [productosPorCategoria, setProductosPorCategoria] = useState<Product[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

  // 👇 Estado para ordenamiento
  const [sortBy, setSortBy] = useState<SortKey>("sold_quantity");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((data) => {
        setRecomendaciones(data.recomendaciones || []);
        setLoading(false);
      });
  }, []);

  const abrirModal = (categoria: string) => {
    fetch("/api/products_mock")
      .then((res) => res.json())
      .then((data) => {
        setProductosPorCategoria(data[categoria].slice(0, 10));
        setCategoriaActiva(categoria);
      });
  };

  const cerrarModal = () => {
    setCategoriaActiva(null);
    setProductosPorCategoria([]);
  };

  const toggleSort = (key: SortKey) => {
    if (key === sortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...productosPorCategoria].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (typeof valA === "string") {
      return sortDirection === "asc"
        ? valA.localeCompare(valB as string)
        : (valB as string).localeCompare(valA);
    } else {
      return sortDirection === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    }
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        🧠 Análisis Inteligente de Productos por Categoría
      </h1>

      {loading ? (
        <p className="text-center text-xl">⏳ Analizando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recomendaciones.map(({ categoria, recomendado }) => (
            <div
              key={recomendado.id}
              onClick={() => abrirModal(categoria)}
              className="cursor-pointer bg-blue rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={recomendado.thumbnail}
                  alt={recomendado.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  Categoría: {categoria}
                </p>
                <h2 className="font-semibold text-md mb-2 line-clamp-2">
                  {recomendado.title}
                </h2>
                <p className="text-lg font-bold text-green-600 mb-1">
                  ${recomendado.price.toLocaleString("es-AR")}
                </p>
                <p className="text-sm text-gray-500">
                  Vendidos: {recomendado.sold_quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {categoriaActiva && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Productos destacados en: <span className="capitalize">{categoriaActiva}</span>
              </h2>
              <button
                onClick={cerrarModal}
                className="text-red-600 hover:underline font-medium"
              >
                Cerrar
              </button>
            </div>

            <table className="w-full text-sm text-left text-gray-800">
              <thead className="bg-gray-200 text-gray-900 font-semibold">
                <tr>
                  <th className="p-3">Imagen</th>
                  <th
                    className={`p-3 cursor-pointer transition-all ${
                      sortBy === "title" ? "text-blue-700 underline" : "hover:text-blue-500"
                    }`}
                    onClick={() => toggleSort("title")}
                  >
                    Nombre {sortBy === "title" ? (sortDirection === "asc" ? "▲" : "▼") : "⇅"}
                  </th>
                  <th
                    className={`p-3 cursor-pointer transition-all ${
                      sortBy === "price" ? "text-blue-700 underline" : "hover:text-blue-500"
                    }`}
                    onClick={() => toggleSort("price")}
                  >
                    Precio {sortBy === "price" ? (sortDirection === "asc" ? "▲" : "▼") : "⇅"}
                  </th>
                  <th
                    className={`p-3 cursor-pointer transition-all ${
                      sortBy === "sold_quantity" ? "text-blue-700 underline" : "hover:text-blue-500"
                    }`}
                    onClick={() => toggleSort("sold_quantity")}
                  >
                    Vendidos {sortBy === "sold_quantity" ? (sortDirection === "asc" ? "▲" : "▼") : "⇅"}
                  </th>
                  <th className="p-3">Link</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((prod) => (
                  <tr key={prod.id} className="border-b hover:bg-gray-100 transition">
                    <td className="p-2">
                      <img
                        src={prod.thumbnail}
                        alt={prod.title}
                        className="w-14 h-14 rounded object-cover border"
                      />
                    </td>
                    <td className="p-2 font-medium text-gray-900">{prod.title}</td>
                    <td className="p-2 font-semibold text-green-700">
                      ${prod.price.toLocaleString("es-AR")}
                    </td>
                    <td className="p-2 text-gray-700">{prod.sold_quantity}</td>
                    <td className="p-2">
                      <a
                        href={prod.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Ver
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
