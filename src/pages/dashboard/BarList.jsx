export default function BarList({ title, data }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500 mb-4">{title}</h3>

      {data.length === 0 ? (
        <p className="text-sm text-gray-400">No data yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between text-sm text-[#073B4C] mb-1">
                <span>{item.name}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded h-2">
                <div
                  className="bg-[#0F4C5C] h-2 rounded"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}