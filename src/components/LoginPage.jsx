import React, { useState } from "react";
import { Plane, LogIn } from "lucide-react";
import { Register, loginUser } from "../utils/fetch";
import { FiEye, FiEyeOff } from "react-icons/fi";

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        email: formData.email,
        password: formData.password
      });

      if (!user?.user_id) {
        alert("User not found");
        window.location.reload();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4 gap-5">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        <div className="flex items-center justify-center mb-6">
          <Plane className="w-12 h-12 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">OracleSky</h1>
        </div>

        <div className="flex mb-6 gap-0.5 bg-gray-100 rounded-lg p-1">
    <button
      onClick={() => setIsLogin(true)}
      className={`
        flex-1 py-2 rounded-lg
        transition-colors duration-300
          ${isLogin
            ? "bg-blue-600 text-white"
            : "bg-gray text-gray-700 hover:bg-blue-600 hover:text-white"}
      `}
    > Login 
    </button> 
    <button
      onClick={() => setIsLogin(false)}
        className={`
            flex-1 py-2 rounded-lg
              transition-colors duration-300
              ${!isLogin
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-300 hover:text-white"}
          `}
        >
        Register
        </button>
    </div>
        {isLogin ? (
          <>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={v => setFormData({ ...formData, email: v })}
            />

            <label style={{ display: "block", marginBottom: 6 }}>
              Password
            </label>
                    
            <div style={{ position: "relative" }}>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={v => setFormData({ ...formData, password: v })}
                style={{
                  paddingRight: "42px",
                  height: "48px",          // match your input height
                  boxSizing: "border-box"
                }}
              />
            
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  height: "48px",    
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

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

            <label style={{ display: "block", marginBottom: 6 }}>
              Password
            </label>
                    
            <div style={{ position: "relative" }}>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={v => setFormData({ ...formData, password: v })}
                style={{
                  paddingRight: "42px",
                  height: "48px",          // match your input height
                  boxSizing: "border-box"
                }}
              />
            
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  height: "48px",    
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

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