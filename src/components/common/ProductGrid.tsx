
// components/ProductGrid.js
const products = [
  { name: 'Orange Cookies', price: '$25.00', quantity: '500g', image: '/images/orange-cookies.jpg' },
  { name: 'Oranges', price: '$30.00', quantity: 'Dozen', image: '/images/oranges.jpg' },
  // Add more products...
];

export default function ProductGrid() {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Popular Products</h2>
        <button className="text-blue-600 hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, idx) => (
          <div key={idx} className="bg-white shadow p-4 rounded">
            <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2 rounded" />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.price} / {product.quantity}</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
