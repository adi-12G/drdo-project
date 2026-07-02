import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/dashboard/layout.jsx";
import Dashboard from "./pages/dashboard/page";
import Employees from "./pages/dashboard/employees/page";
import Cadres from "./pages/dashboard/cadres/page.jsx";
import Designations from "./pages/dashboard/designations/page.jsx";
import Groups from "./pages/dashboard/groups/page.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="cadres" element={<Cadres />} />
          <Route path="designations" element={<Designations />} />
          <Route path="groups" element={<Groups />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;