import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/dashboard/layout.jsx";
import Dashboard from "./pages/dashboard/page";
import Employees from "./pages/dashboard/employees/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;