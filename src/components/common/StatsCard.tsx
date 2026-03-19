
// components/StatsCards.js
export default function StatsCards() {
  const stats = [
    { label: 'Opening Drawer Amount', value: '2,643' },
    { label: 'Orders', value: '3,125' },
    { label: 'Products', value: '2,563' },
    { label: 'Customers', value: '$13,517' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white shadow p-4 rounded">
          <h4 className="text-gray-500 text-sm">{stat.label}</h4>
          <p className="text-xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
