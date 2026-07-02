import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import BarList from "./BarList";
import StatusBreakdown from "./StatusBreakdown";
import NeedsAttention from "./NeedsAttention";
import QuickActions from "./QuickActions";
import DirectorySearch from "./DirectorySearch";

export default function AdminDashboard({ data }) {
  const navigate = useNavigate();
  const { counts, status_breakdown, employees_by_cadre, employees_by_group, needs_attention } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Employees" value={counts.employees} />
        <StatCard label="Cadres" value={counts.cadres} />
        <StatCard label="Designations" value={counts.designations} />
        <StatCard label="Groups" value={counts.groups} />
      </div>

      <QuickActions />

      <div className="grid grid-cols-2 gap-6">
        <BarList title="Employees by Cadre" data={employees_by_cadre} />
        <BarList title="Employees by Group" data={employees_by_group} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <StatusBreakdown active={status_breakdown.active} inactive={status_breakdown.inactive} />
        <DirectorySearch />
      </div>

      <NeedsAttention items={needs_attention} onGoToEmployees={() => navigate("/dashboard/employees")} />
    </div>
  );
}