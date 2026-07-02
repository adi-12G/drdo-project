export default function StatCard({ label, value, accent = "text-[#073B4C]" }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500">{label}</h3>
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}