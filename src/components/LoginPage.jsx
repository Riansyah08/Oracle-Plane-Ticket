import React, { useState } from "react";
import { Plane, LogIn } from "lucide-react";
import { Register, loginUser } from "../utils/fetch";

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userAccID: "",
    email: "",
    password: "",
    full_name: "",
    phone_number: ""
  });

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginUser({
        userAccID: formData.userAccID,
        email: formData.email
      });

      if (!user) {
        alert("User not found");
        return;
      }

      // 🔹 LoginPage does NOT care how transactions are fetched
      onLogin(user);

    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    setLoading(true);
    try {
      await Register(formData);
      alert("Registration successful. Please login.");
      setIsLogin(true);
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        <div className="flex items-center justify-center mb-6">
          <Plane className="w-12 h-12 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">OracleSky</h1>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 rounded-lg transition ${
              isLogin ? "bg-white shadow" : ""
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-lg transition ${
              !isLogin ? "bg-white shadow" : ""
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <>
            <Input
              label="User Account ID"
              value={formData.userAccID}
              onChange={v => setFormData({ ...formData, userAccID: v })}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={v => setFormData({ ...formData, email: v })}
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        ) : (
          <>
            <Input
              label="Full Name"
              value={formData.full_name}
              onChange={v => setFormData({ ...formData, full_name: v })}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={v => setFormData({ ...formData, email: v })}
            />

            <Input
              label="Phone Number"
              value={formData.phone_number}
              onChange={v => setFormData({ ...formData, phone_number: v })}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={v => setFormData({ ...formData, password: v })}
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        className="w-full px-4 py-2 border rounded-lg"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

export default LoginPage;