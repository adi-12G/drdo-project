import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("authUser") || "null");

  if (!token || !user) return;

  if (user.role === "admin") {
    navigate("/dashboard", { replace: true });
  } else if (user.role === "employee") {
    navigate("/employee/dashboard", { replace: true });
  } else if (user.role === "adgh") {
    navigate("/dashboard", { replace: true });
  }
}, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      localStorage.setItem("authToken", data.token);
localStorage.setItem("authUser", JSON.stringify(data.user));

if (data.user.role === "admin") {
  navigate("/dashboard");
} else if (data.user.role === "employee") {
  navigate("/employee/dashboard");
} else if (data.user.role === "adgh") {
  navigate("/dashboard");
}
    } catch (loginError) {
      setError(loginError.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f7f9] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow p-8 space-y-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#073B4C]">DRDO Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in with the seeded admin account.
          </p>
        </div>

        <input
          type="text"
          placeholder="Username"
          className="w-full border rounded p-3 text-black"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded p-3 text-black"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0F4C5C] text-white rounded p-3 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
