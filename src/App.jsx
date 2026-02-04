import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import BookFlightPage from "./components/BookFlightPage";
import RewardsPage from "./components/RewardsPage";
import TransactionsPage from "./components/TransactionsPage";
import Navbar from "./components/Navbar";

import { item_select, Transactionlog } from "./utils/fetch";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);

  // 🔥 REAL DATA (NO DUMMY)
  const [rewardItems, setRewardItems] = useState([]);
  const [transactions, setTransactions] = useState([]);

  /* ================= LOGIN ================= */
  const handleLogin = async (user) => {
    setCurrentUser(user);
    setCurrentPage("home");

    try {
      // 🎁 Load rewards
      const items = await item_select();
      setRewardItems(items);

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

  return (
    <div className="h-screen flex flex-col bg-indigo-200 overflow-hidden">
      <Navbar onNavigate={setCurrentPage} onLogout={handleLogout} />

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4">
          {currentPage === "home" && (
            <HomePage user={currentUser} onNavigate={setCurrentPage} />
          )}

          {currentPage === "purchase" && (
            <BookFlightPage
              user={currentUser}
              updateUser={updateUser}
              addTransaction={addTransaction}
            />
          )}

          {currentPage === "redeem" && (
            <RewardsPage
              user={currentUser}
              rewardItems={rewardItems}
              updateUser={updateUser}
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
