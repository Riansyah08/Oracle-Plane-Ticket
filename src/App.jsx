import React, { useState, useEffect, useRef} from "react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import BookFlightPage from "./components/BookFlightPage";
import RewardsPage from "./components/RewardsPage";
import TransactionsPage from "./components/TransactionsPage";
import Navbar from "./components/Navbar";
import { Transactionlog } from "./utils/fetch";

function App({}) {
  const [currentPage, setCurrentPage] = useState("purchase");
  const [currentUser, setCurrentUser] = useState(null);

  // 🔥 REAL DATA (NO DUMMY)
  const [rewardItems, setRewardItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setCurrentUser(parsedUser);
    setCurrentPage("home"); // or "purchase" if you want default
  }

  setLoading(false);
}, []);

  /* ================= LOGIN ================= */
  const handleLogin = async (user) => {
    setCurrentUser(user);
    setCurrentPage("home");
    try {
      // 📜 Load transactions
      const txs = await Transactionlog({
        email: user.email,
        password: user.password
      });

      if (!txs || txs.length === 0) {
        alert("Transaction History Page is in Maintenance Right Now");
        return;
      }
      setTransactions(txs);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  const isUserInvalid = !currentUser || currentUser.user_id === undefined || currentUser.full_name === '';

  if (!currentUser && currentPage !== "purchase") {
    return <LoginPage onLogin={handleLogin} />;
  }

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

  /* ================= ROUTING ================= */
  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />;
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
            />
          )}

          {currentPage === "redeem" && (
            <RewardsPage
              user={currentUser}
              setCurrentUser={setCurrentUser}
              rewardItems={rewardItems}
              addTransaction={addTransaction}
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
