
// components/CategoryTabs.js
type CategoryTabsProps = {
  selected: string;
  onSelect: (category: string) => void;
};

export default function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  const categories = ['Vegetables', 'Bakery', 'Grocery', 'Dairy Product', 'Gas', 'Meat', 'Experts', 'Fruits'];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded ${selected === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
