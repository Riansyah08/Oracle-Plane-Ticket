import React, { useState } from 'react';
import { Plane, User, LogIn, Award, ShoppingCart, History, MapPin } from 'lucide-react';

const PlaneOsb = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLogin, setIsLogin] = useState(true);
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

  const [flights, setFlights] = useState([
    { id: 'FL001', from: 'New York', to: 'Los Angeles', price: 350, points: 500, duration: '5h 30m', aircraft: 'Boeing 737' },
    { id: 'FL002', from: 'New York', to: 'London', price: 650, points: 900, duration: '7h 15m', aircraft: 'Airbus A380' },
    { id: 'FL003', from: 'Los Angeles', to: 'Tokyo', price: 800, points: 1200, duration: '11h 45m', aircraft: 'Boeing 787' },
    { id: 'FL004', from: 'London', to: 'Paris', price: 150, points: 200, duration: '1h 15m', aircraft: 'Airbus A320' },
    { id: 'FL005', from: 'Tokyo', to: 'Singapore', price: 450, points: 650, duration: '6h 30m', aircraft: 'Boeing 777' },
  ]);

  const [rewardItems, setRewardItems] = useState([
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

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: ''
  });

  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [filteredFlights, setFilteredFlights] = useState([]);

  const cities = ['New York', 'Los Angeles', 'London', 'Paris', 'Tokyo', 'Singapore'];

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Platinum': return 'text-purple-600';
      case 'Gold': return 'text-yellow-600';
      case 'Silver': return 'text-gray-500';
      default: return 'text-blue-600';
    }
  };

  const handleLogin = () => {
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('home');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = () => {
    const newUser = {
      user_id: `SM${String(users.length + 1).padStart(3, '0')}`,
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone_number,
      join_date: new Date().toISOString().split('T')[0],
      points_balance: 1000,
      km_hit: 0,
      account_tier: 'Silver'
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('home');
  };

  const handleSearchFlights = () => {
    if (selectedFrom && selectedTo) {
      const results = flights.filter(f => f.from === selectedFrom && f.to === selectedTo);
      setFilteredFlights(results);
    }
  };

  const handlePurchaseFlight = (flight) => {
    if (currentUser.points_balance >= flight.points) {
      const updatedUser = {
        ...currentUser,
        points_balance: currentUser.points_balance - flight.points,
        km_hit: currentUser.km_hit + 5000
      };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.user_id === currentUser.user_id ? updatedUser : u));
      
      const newTransaction = {
        id: `T${String(transactions.length + 1).padStart(3, '0')}`,
        user_id: currentUser.user_id,
        type: 'Flight Purchase',
        description: `${flight.id} - ${flight.from} to ${flight.to}`,
        points: -flight.points,
        date: new Date().toISOString().split('T')[0],
        amount: flight.price
      };
      setTransactions([...transactions, newTransaction]);
      alert(`Flight purchased successfully! ${flight.points} points deducted.`);
    } else {
      alert('Insufficient points balance!');
    }
  };

  const handleRedeemItem = (item) => {
    if (currentUser.points_balance >= item.points) {
      const tierOrder = ['Silver', 'Gold', 'Platinum'];
      if (tierOrder.indexOf(currentUser.account_tier) >= tierOrder.indexOf(item.tier)) {
        const updatedUser = {
          ...currentUser,
          points_balance: currentUser.points_balance - item.points
        };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.user_id === currentUser.user_id ? updatedUser : u));
        
        const newTransaction = {
          id: `T${String(transactions.length + 1).padStart(3, '0')}`,
          user_id: currentUser.user_id,
          type: 'Reward Redemption',
          description: item.name,
          points: -item.points,
          date: new Date().toISOString().split('T')[0],
          amount: 0
        };
        setTransactions([...transactions, newTransaction]);
        alert(`${item.name} redeemed successfully!`);
      } else {
        alert(`This reward requires ${item.tier} tier or higher!`);
      }
    } else {
      alert('Insufficient points balance!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    setFormData({ email: '', password: '', full_name: '', phone_number: '' });
  };

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="flex items-center justify-center mb-6">
            <Plane className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">SkyMiles</h1>
          </div>
          
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 rounded-lg transition ${isLogin ? 'bg-white shadow' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-lg transition ${!isLogin ? 'bg-white shadow' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <button
                onClick={handleRegister}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <nav className="bg-blue-600 text-white p-4 shadow-lg flex-shrink-0">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Plane className="w-8 h-8 mr-2" />
            <span className="text-2xl font-bold">SkyMiles Portal</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setCurrentPage('home')} className="hover:bg-blue-700 px-4 py-2 rounded">Home</button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {currentPage === 'home' && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <User className="w-10 h-10 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold">Welcome, {currentUser.full_name}!</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="text-xl font-bold">{currentUser.user_id}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Account Tier</p>
                    <p className={`text-xl font-bold ${getTierColor(currentUser.account_tier)}`}>
                      {currentUser.account_tier}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Points Balance</p>
                    <p className="text-lg font-bold text-purple-600">{currentUser.points_balance.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">KM Hit</p>
                    <p className="text-lg font-bold text-orange-600">{currentUser.km_hit.toLocaleString()} km</p>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-bold text-pink-600">{currentUser.join_date}</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h3 className="text-lg font-bold mb-2">Contact Information</h3>
                  <p className="text-sm text-gray-700"><strong>Email:</strong> {currentUser.email}</p>
                  <p className="text-sm text-gray-700"><strong>Phone:</strong> {currentUser.phone_number}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentPage('purchase')}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <ShoppingCart className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Book Flight</h3>
                  <p className="text-sm text-gray-600">Search and purchase flight tickets</p>
                </button>

                <button
                  onClick={() => setCurrentPage('redeem')}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Rewards</h3>
                  <p className="text-sm text-gray-600">Redeem your points for rewards</p>
                </button>

                <button
                  onClick={() => setCurrentPage('transactions')}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Transactions</h3>
                  <p className="text-sm text-gray-600">View your transaction history</p>
                </button>
              </div>
            </div>
          )}

          {currentPage === 'purchase' && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <ShoppingCart className="w-7 h-7 mr-2 text-blue-600" />
                  Book a Flight
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold text-sm">From</label>
                    <select
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedFrom}
                      onChange={(e) => setSelectedFrom(e.target.value)}
                    >
                      <option value="">Select departure city</option>
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold text-sm">To</label>
                    <select
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedTo}
                      onChange={(e) => setSelectedTo(e.target.value)}
                    >
                      <option value="">Select destination city</option>
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSearchFlights}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
                >
                  Search Flights
                </button>

                {filteredFlights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3">Available Flights</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {filteredFlights.map(flight => (
                        <div key={flight.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-lg">{flight.from} → {flight.to}</p>
                            <p className="text-sm text-gray-600">Flight: {flight.id} | Aircraft: {flight.aircraft}</p>
                            <p className="text-sm text-gray-600">Duration: {flight.duration}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-blue-600">{flight.points} pts</p>
                            <p className="text-sm text-gray-600">${flight.price}</p>
                            <button
                              onClick={() => handlePurchaseFlight(flight)}
                              className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600 transition text-sm"
                            >
                              Purchase
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentPage === 'redeem' && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Award className="w-7 h-7 mr-2 text-yellow-600" />
                  Redeem Rewards
                </h2>
                <p className="mb-2 text-sm text-gray-600">Your current tier: <span className={`font-bold ${getTierColor(currentUser.account_tier)}`}>{currentUser.account_tier}</span></p>
                <p className="mb-4 text-sm text-gray-600">Available points: <span className="font-bold text-purple-600">{currentUser.points_balance.toLocaleString()}</span></p>

                <div className="space-y-3 max-h-170 overflow-y-auto pr-2">
                  {rewardItems.map(item => {
                    const tierOrder = ['Silver', 'Gold', 'Platinum'];
                    const canRedeem = tierOrder.indexOf(currentUser.account_tier) >= tierOrder.indexOf(item.tier);
                    
                    return (
                      <div key={item.id} className={`border rounded-lg p-4 ${!canRedeem ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-lg">{item.name}</p>
                            <p className="text-sm text-gray-600">Category: {item.category}</p>
                            <p className={`text-xs ${getTierColor(item.tier)}`}>Requires: {item.tier} Tier</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-600">{item.points} pts</p>
                            <button
                              onClick={() => handleRedeemItem(item)}
                              disabled={!canRedeem}
                              className={`px-4 py-2 rounded mt-2 transition text-sm ${
                                canRedeem 
                                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              Redeem
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentPage === 'transactions' && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <History className="w-7 h-7 mr-2 text-gray-600" />
                  Transaction History
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {transactions
                    .filter(t => t.user_id === currentUser.user_id)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(transaction => (
                      <div key={transaction.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-2">
                          <div className="flex-1">
                            <p className="font-bold">{transaction.type}</p>
                            <p className="text-sm text-gray-600">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{transaction.date}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                            </p>
                            {transaction.amount > 0 && (
                              <p className="text-sm text-gray-600">${transaction.amount}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaneOsb;