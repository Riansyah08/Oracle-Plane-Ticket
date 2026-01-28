import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import {purchasePlane} from '../utils/fetch.js';

function BookFlightPage({ user, flights, updateUser, addTransaction }) {
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [filteredFlights, setFilteredFlights] = useState([]);

  const cities = ['New York', 'Los Angeles', 'London', 'Paris', 'Tokyo', 'Singapore'];

  const handleSearchFlights = () => {
    if (selectedFrom && selectedTo) {
      const results = flights.filter(f => f.from === selectedFrom && f.to === selectedTo);
      setFilteredFlights(results);
    }
  };

 const handlePurchaseFlight = async (flight) => {
  if (user.points_balance >= flight.points) {
    const updatedUser = {
      ...user,
      points_balance: user.points_balance - flight.points,
      km_hit: user.km_hit + 5000, 
    };

    updateUser(updatedUser);

    const newTransaction = {
      id: `T${String(Math.random()).substring(2, 8)}`,
      user_id: user.user_id,
      type: 'Flight Purchase',
      description: `${flight.id} - ${flight.from} to ${flight.to}`,
      points: -flight.points,
      date: new Date().toISOString().split('T')[0],
      amount: flight.price,
    };

    // POST request handled here
    await purchasePlane(newTransaction);

    alert(`Flight purchased successfully! ${flight.points} points deducted.`);
  } else {
    alert('Insufficient points balance!');
  }
};


  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="w-7 h-7 mr-2 text-blue-600" />
          Book a Flight
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">From</label>
            <select
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              value={selectedFrom}
              onChange={(e) => setSelectedFrom(e.target.value)}
            >
              <option value="">Select departure city</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">To</label>
            <select
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition mb-6 text-base font-semibold"
        >
          Search Flights
        </button>

        {filteredFlights.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Available Flights</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {filteredFlights.map(flight => (
                <div key={flight.id} className="border rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-xl mb-1">{flight.from} → {flight.to}</p>
                    <p className="text-gray-600">Flight: {flight.id} | Aircraft: {flight.aircraft}</p>
                    <p className="text-gray-600">Duration: {flight.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{flight.points} pts</p>
                    <p className="text-gray-600 mb-2">${flight.price}</p>
                    <button
                      onClick={() => handlePurchaseFlight(flight)}
                      className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold"
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
  );
}

export default BookFlightPage;
