
// ============================================
// File: src/App.jsx
// ============================================
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import BookFlightPage from './components/BookFlightPage';
import RewardsPage from './components/RewardsPage';
import TransactionsPage from './components/TransactionsPage';
import Navbar from './components/Navbar';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  
  const [users, setUsers] = useState([
    {
      user_id: 'SM001',
      full_name: 'John Smith',
      email: 'john.smith@email.com',
      password: 'password123',
      phone_number: '+1-555-0123',
      join_date: '2023-01-15',
      points_balance: 15000,
      km_hit: 45000,
      account_tier: 'Gold'
    },
    {
      user_id: 'SM002',
      full_name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      password: 'pass456',
      phone_number: '+1-555-0456',
      join_date: '2022-06-20',
      points_balance: 35000,
      km_hit: 120000,
      account_tier: 'Platinum'
    }
  ]);

  const [flights] = useState([
    { id: 'FL001', from: 'New York', to: 'Los Angeles', price: 350, flightnumber: 500, duration: '5h 30m', aircraft: 'Boeing 737' },
    { id: 'FL002', from: 'New York', to: 'London', price: 650, flightnumber: 900, duration: '7h 15m', aircraft: 'Airbus A380' },
    { id: 'FL003', from: 'Los Angeles', to: 'Tokyo', price: 800, flightnumber: 1200, duration: '11h 45m', aircraft: 'Boeing 787' },
    { id: 'FL004', from: 'London', to: 'Paris', price: 150, flightnumber: 200, duration: '1h 15m', aircraft: 'Airbus A320' },
    { id: 'FL005', from: 'Tokyo', to: 'Singapore', price: 450, flightnumber: 650, duration: '6h 30m', aircraft: 'Boeing 777' },
  ]);

  const [rewardItems] = useState([
    { id: 'R001', name: 'Priority Boarding Pass', points: 2000, tier: 'Silver', category: 'Service' },
    { id: 'R002', name: 'Lounge Access (Single Entry)', points: 3000, tier: 'Silver', category: 'Service' },
    { id: 'R003', name: 'Extra Baggage Allowance', points: 4000, tier: 'Silver', category: 'Service' },
    { id: 'R004', name: 'Business Class Upgrade', points: 8000, tier: 'Gold', category: 'Upgrade' },
    { id: 'R005', name: 'Annual Lounge Membership', points: 12000, tier: 'Gold', category: 'Service' },
    { id: 'R006', name: 'Companion Ticket', points: 15000, tier: 'Platinum', category: 'Ticket' },
    { id: 'R007', name: 'First Class Upgrade', points: 20000, tier: 'Platinum', category: 'Upgrade' },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 'T001', user_id: 'SM001', type: 'Flight Purchase', description: 'FL001 - New York to Los Angeles', points: -500, date: '2024-12-15', amount: 350 },
    { id: 'T002', user_id: 'SM001', type: 'Points Earned', description: 'Flight completion bonus', points: 1000, date: '2024-12-20', amount: 0 },
    { id: 'T003', user_id: 'SM002', type: 'Reward Redemption', description: 'Business Class Upgrade', points: -8000, date: '2024-11-10', amount: 0 },
    { id: 'T004', user_id: 'SM002', type: 'Flight Purchase', description: 'FL003 - Los Angeles to Tokyo', points: -1200, date: '2024-10-05', amount: 800 },
  ]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('home');
  };

  const handleRegister = (newUser) => {
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.user_id === updatedUser.user_id ? updatedUser : u));
  };

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  if (currentPage === 'login') {
    return (
      <LoginPage 
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navbar 
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {currentPage === 'home' && (
            <HomePage 
              user={currentUser}
              onNavigate={setCurrentPage}
            />
          )}
          
          {currentPage === 'purchase' && (
            <BookFlightPage 
              user={currentUser}
              flights={flights}
              updateUser={updateUser}
              addTransaction={addTransaction}
            />
          )}
          
          {currentPage === 'redeem' && (
            <RewardsPage 
              user={currentUser}
              rewardItems={rewardItems}
              updateUser={updateUser}
              addTransaction={addTransaction}
            />
          )}
          
          {currentPage === 'transactions' && (
            <TransactionsPage 
              user={currentUser}
              transactions={transactions}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;