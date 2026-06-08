import React, { useState } from "react";
import { Plane, LogIn, KeyRound, User } from "lucide-react";
import { Register, loginUser, Changepassword } from "../utils/fetch";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";

function LoginPage({ onLogin }) {
  const [view, setView] = useState("login");        // ✅ replaces isLogin
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ added
  const [isMaintenance, setIsMaintenance] = useState(false); // ✅ added

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone_number: ""
  });
  const set = (field) => (v) => setFormData((prev) => ({ ...prev, [field]: v })); // ✅ added

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
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("lastActivity", Date.now());
    } catch (err) {
      console.error(err);

      const status = err.response?.status || err.status;

      if (
        status >= 500 ||
        err.code === "ERR_NETWORK"
      ) {
        setIsMaintenance(true);
        return;
      } else {
        toast.error("Login failed");
      }
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
      setView("login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async () => {
    if (!formData.email) { alert("Please enter your account email."); return; }
    if (!formData.password) { alert("Please enter a new password."); return; }
    if (formData.password !== formData.confirmPassword) { alert("Passwords do not match."); return; }
    setLoading(true);
    try {
      await Changepassword({
        email: formData.email,
        Password: formData.password,
        Password2: formData.confirmPassword,
      });
      alert("Password change requested. Waiting Approval.");
      setView("login");
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  //*Data Helper
  const emptyForm = {
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone_number: ""
  };

  if (isMaintenance) {
    return (
      <div className="h-screen flex items-center justify-center bg-indigo-200">
        <div className="bg-white p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">
            System Under Maintenance
          </h1>

          <p className="text-gray-600">
            Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4 gap-5">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        <div className="flex items-center justify-center mb-6">
          <Plane className="w-12 h-12 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">OSky</h1>
        </div>
    
        {view !== "changePassword" && (
          <div className="flex mb-6 gap-0.5 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {setView("login"); setFormData(emptyForm);}}
              className={`flex-1 py-2 rounded-lg transition-colors duration-300 ${
                view === "login" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-300 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {setView("register"); setFormData(emptyForm);}}
              className={`flex-1 py-2 rounded-lg transition-colors duration-300 ${
                view === "register" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-300 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* ── LOGIN ── */}
        {view === "login" && (
          <>
            <Input label="Email Login" type="email" value={formData.email} onChange={set("email")} />
            <PasswordInput
              label="Password"
              value={formData.password}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              onChange={set("password")}
            />
            <button
              onClick={async () => {await handleLogin(); setView("login");}}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center mt-2"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* 👇 Add this here */}
            <div className="text-center mt-3">

               <a href="#"
                onClick={(e) => { e.preventDefault(); setView("changePassword"); setFormData(emptyForm);}}
                className="text-blue-600 text-sm hover:underline"
              >
                Change Password
              </a>
            </div>
          </>
        )}

        {/* ── REGISTER ── */}
        {view === "register" && (
          <>
            <Input label="Full Name"    value={formData.full_name}    onChange={set("full_name")} />
            <Input label="Email" type="email" value={formData.email}  onChange={set("email")} />
            <Input label="Phone Number" value={formData.phone_number} onChange={set("phone_number")} />
            <PasswordInput
              label="Password"
              value={formData.password}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              onChange={set("password")}
            />
            <button
              onClick={async () => {await handleRegister(); setView("register");}}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center mt-2"
            >
              <User className="w-5 h-5 mr-2"/>
              {loading ? "Registering..." : "Register"}
            </button>
          </>
        )}

        {/* ── CHANGE PASSWORD ── */}
        {view === "changePassword" && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-5 text-center">Change Password</h2>
            <Input label="Account Email" type="email" value={formData.email} onChange={set("email")} />
            <PasswordInput
              label="New Password"
              value={formData.password}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              onChange={set("password")}
            />
            <PasswordInput
              label="Confirm Password"
              value={formData.confirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
              onChange={set("confirmPassword")}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mb-3 -mt-2">Passwords do not match.</p>
            )}
            <button
              onClick={async () => {await handleChangePassword(); setView("changePassword"); setFormData(emptyForm);}}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center mt-2"
            >
              <KeyRound className="w-5 h-5 mr-2" />
              {loading ? "Updating..." : "Change Password"}
            </button>
            <button
              onClick={() => {setView("login"); setFormData(emptyForm);}}
              className="w-full mt-3 text-blue-600 text-sm hover:underline"
            >
              ← Back to Login
            </button>
          </>
        )}

      </div>

    </div>
  );
}

/* ── Shared components ── */
function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        className="w-full px-4 py-2 border rounded-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, onToggle }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          className="w-full px-4 py-2 border rounded-lg"
          style={{ paddingRight: "42px" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: "absolute", right: "12px", top: "50%",
            transform: "translateY(-50%)", background: "none",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center"
          }}
        >
          {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;