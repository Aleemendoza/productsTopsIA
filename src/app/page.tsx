"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sold_quantity: number;
  permalink: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);

    // Carga inicial con productos generales sin filtro
    fetchProducts();
  }, []);

  const fetchProducts = (category = '', query = '') => {
    setLoading(true);
    const url = `/api/search?${category ? `category=${category}&` : ''}${query ? `q=${encodeURIComponent(query)}` : ''}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProductos(data.productos);
        setLoading(false);
      });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId, searchQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(selectedCategory, searchQuery);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">🔎 Buscador de Productos</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-3 rounded-lg w-full shadow-sm"
        />
      </form>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        <button
          onClick={() => {
            setSelectedCategory('');
            fetchProducts('', searchQuery);
          }}
          className={`px-4 py-2 rounded whitespace-nowrap ${selectedCategory === '' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-xl font-semibold">⏳ Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.map((prod) => (
            <a
              key={prod.id}
              href={prod.permalink}
              target="_blank"
              className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={prod.thumbnail}
                  alt={prod.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-md mb-2 line-clamp-2">{prod.title}</h2>
                <p className="text-lg font-bold text-blue-600 mb-1">
                  ${prod.price.toLocaleString('es-AR')}
                </p>
                <p className="text-sm text-gray-500">Vendidos: {prod.sold_quantity}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
