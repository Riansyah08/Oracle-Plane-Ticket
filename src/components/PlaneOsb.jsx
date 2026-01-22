import React from 'react';
import { User, ShoppingCart, Award, History } from 'lucide-react';
import { getTierColor } from '../utils/helpers';

function HomePage({ user, onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <User className="w-10 h-10 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold">Welcome, {user.full_name}!</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">User ID</p>
            <p className="text-xl font-bold">{user.user_id}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Account Tier</p>
            <p className={`text-xl font-bold ${getTierColor(user.account_tier)}`}>
              {user.account_tier}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Points Balance</p>
            <p className="text-lg font-bold text-purple-600">{user.points_balance.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">KM Hit</p>
            <p className="text-lg font-bold text-orange-600">{user.km_hit.toLocaleString()} km</p>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-bold text-pink-600">{user.join_date}</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <h3 className="text-lg font-bold mb-2">Contact Information</h3>
          <p className="text-sm text-gray-700"><strong>Email:</strong> {user.email}</p>
          <p className="text-sm text-gray-700"><strong>Phone:</strong> {user.phone_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('purchase')}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <ShoppingCart className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-1">Book Flight</h3>
          <p className="text-sm text-gray-600">Search and purchase flight tickets</p>
        </button>

        <button
          onClick={() => onNavigate('redeem')}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-1">Rewards</h3>
          <p className="text-sm text-gray-600">Redeem your points for rewards</p>
        </button>

        <button
          onClick={() => onNavigate('transactions')}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-1">Transactions</h3>
          <p className="text-sm text-gray-600">View your transaction history</p>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
