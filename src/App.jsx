import React, { useState, useEffect, useRef} from "react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import BookFlightPage from "./components/BookFlightPage";
import RewardsPage from "./components/RewardsPage";
import TransactionsPage from "./components/TransactionsPage";
import Navbar from "./components/Navbar";
import { MaintenanceCheck, Transactionlog } from "./utils/fetch";
import spinner from "./assets/icons8-spinner-50.gif";

function App({}) {
  const [currentPage, setCurrentPage] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? "home" : "purchase";
  });
  const [currentUser, setCurrentUser] = useState(null);

  // 🔥 REAL DATA (NO DUMMY)
  const [rewardItems, setRewardItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoginMaintenance, setIsLoginMaintenance] = useState(false);
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);
  
  const IDLE_TIME = 30 * 60 * 1000;
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    // Save last activity
    localStorage.setItem("lastActivity", Date.now());

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, IDLE_TIME);
  };

  useEffect(() => {
  const events = ["mousemove", "keydown", "click", "scroll"];

  const handleActivity = () => {
    resetTimer();
  };

  events.forEach(event =>
    window.addEventListener(event, handleActivity)
  );

// 🔥 Restore timer after refresh
const lastActivity = localStorage.getItem("lastActivity");

  if (lastActivity) {
    const diff = Date.now() - lastActivity;

    if (diff > IDLE_TIME) {
      handleLogout();
    } else {
      timeoutRef.current = setTimeout(
        handleLogout,
        IDLE_TIME - diff
      );
    }
  } else {
    resetTimer();
  }

  return () => {
    events.forEach(event =>
      window.removeEventListener(event, handleActivity)
    );
    clearTimeout(timeoutRef.current);
  };
}, []);

  /* ================= LOGIN ================= */
  const handleLogin = async (user) => {
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      const redirectPage =
        localStorage.getItem("redirectAfterLogin") || "home";

      setCurrentPage(redirectPage);
      localStorage.removeItem("redirectAfterLogin");
    try {
      // 📜 Load transactions
      const txs = await Transactionlog({
        email: user.email,
        password: user.password
      });
      setTransactions(txs);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const mtscheck = await MaintenanceCheck("DASHBOARD");

        const mtschecklogin = await MaintenanceCheck("LOGIN");

        if (mtscheck.availability === "N") {
          setIsMaintenance(true);

          // 🔥 FORCE LOGOUT EVERYTHING
          setCurrentUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("lastActivity");
        }

        if (mtschecklogin.availability === "N") {
          setIsLoginMaintenance(true);
        }
      } catch (err) {
        console.error("Maintenance check failed:", err);
      } finally {
        setCheckingMaintenance(false);
      }
    };

    checkMaintenance();
  }, []);

  useEffect(() => {
    if (isMaintenance) return;

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
    }

    setLoading(false);
  }, [isMaintenance]);

  const handleLogout = () => {
    setCurrentUser(null);
    setRewardItems([]);
    setTransactions([]);
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
  };

  /* ================= USER UPDATE ================= */
  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  /* ================= TRANSACTION APPEND ================= */
  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

/* ---------------- Persist Search State ---------------- */
const [flightSearchState, setFlightSearchState] = useState({
  selectedFrom: "",
  selectedTo: "",
  departureDate: "",
  filteredFlights: [],
  hasSearched: false
});

  /* ================= ROUTING ================= */
  if (currentPage === "login" && isLoginMaintenance) {
      if (checkingMaintenance) {
        return (
          <div className="flex items-center justify-center h-screen">
            <img src={spinner} alt="Loading..." />
          </div>
        )
      }

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
    );
  }
  
  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />;
  } 

  if (!currentUser && currentPage !== "purchase" && currentPage !== "redeem") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (checkingMaintenance) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={spinner} alt="Loading..." />
      </div>
    )
  }

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
    );
  }

  return (
    <div className="h-screen flex flex-col bg-indigo-200 overflow-hidden">
      <Navbar onNavigate={setCurrentPage} onLogout={handleLogout} user={currentUser}/>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4">
          {currentPage === "home" && (
            <HomePage user={currentUser} onNavigate={setCurrentPage} />
          )}

          {currentPage === "purchase" && (
            <BookFlightPage
              user={currentUser}
              setCurrentUser={setCurrentUser}
              addTransaction={addTransaction}
              onNavigate={setCurrentPage}   
              flightSearchState={flightSearchState}
              setFlightSearchState={setFlightSearchState}
            />
          )}

          {currentPage === "redeem" && (
            <RewardsPage
              user={currentUser}
              setCurrentUser={setCurrentUser}
              rewardItems={rewardItems}
              addTransaction={addTransaction}
              onNavigate={setCurrentPage}   
            />
          )}

          {currentPage === "transactions" && (
            <TransactionsPage
              user={currentUser}
              transactions={transactions}
              rewardItems={rewardItems}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
