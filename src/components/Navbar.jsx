export default function Navbar() {
  return (
    <header className="bg-[#0F4C5C] text-white h-16 flex items-center px-6 shadow">
      <img
        src="/drdo-logo.png"
        alt="DRDO"
        className="h-10 w-10 mr-4"
      />

      <div>
        <h1 className="font-semibold text-lg">
          DRDO Employee Management System
        </h1>

        <p className="text-xs text-gray-200">
          Defence Research and Development Organisation
        </p>
      </div>
    </header>
  );
}