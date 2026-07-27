import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/dashboard/layout.jsx";
import Dashboard from "./pages/dashboard/page";
import Employees from "./pages/dashboard/employees/page";
import Cadres from "./pages/dashboard/cadres/page.jsx";
import Designations from "./pages/dashboard/designations/page.jsx";
import Groups from "./pages/dashboard/groups/page.jsx";
import InternalDesignationsPage from "./pages/dashboard/internal-designations/page.jsx";
import ADGHPage from "./pages/dashboard/adgh/page.jsx";

import EmployeeLayout from "./pages/employee/layout";
import EmployeeDashboard from "./pages/employee/Dashboard";
import Profile from "./pages/employee/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Login />} />

  {/* Admin Routes */}
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="employees" element={<Employees />} />
    <Route path="cadres" element={<Cadres />} />
    <Route path="designations" element={<Designations />} />
    <Route path="groups" element={<Groups />} />
    <Route
      path="internal-designations"
      element={<InternalDesignationsPage />}
    />
    <Route path="adgh" element={<ADGHPage />} />
  </Route>

  {/* Employee Routes */}
  <Route path="/employee" element={<EmployeeLayout />}>
    <Route index element={<EmployeeDashboard />} />
    <Route path="dashboard" element={<EmployeeDashboard />} />
    <Route path="profile" element={<Profile />} />
  </Route>
</Routes>
    </BrowserRouter>
  );
}

export default App;
