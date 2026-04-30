import React, { useState } from "react";
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
      setTransactions(txs);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  const isUserInvalid = !currentUser || currentUser.user_id === undefined || currentUser.full_name === '';

  if (currentPage === "home" && isUserInvalid) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setRewardItems([]);
    setTransactions([]);
    setCurrentPage("login");
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
  
  if (currentPage === "purchase") {
    return <div className="h-screen flex flex-col bg-indigo-200 overflow-hidden">
      <Navbar onNavigate={setCurrentPage} onLogout={handleLogout} user={currentUser}/>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4">
          {currentPage === "purchase" && (
            <BookFlightPage
              user={currentUser}
              setCurrentUser={setCurrentUser}
              addTransaction={addTransaction}
            />
          )}
        </div>
      </div>
    </div>
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
