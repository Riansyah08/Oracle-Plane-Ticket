import React from 'react';
import { User, ShoppingCart, Award, History } from 'lucide-react';
import { getTierColor } from '../utils/helpers';

/* ---------------- Helpers ---------------- */
  const formatDateTime = iso =>
    iso
      ? new Date(iso).toLocaleString('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      : '-';


function HomePage({ user, onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-18 mb-10">
        <div className="flex items-center mb-4">
          <h2 className="ml-auto text-lg font-semibold">OracleSky Membership Account Detail</h2>
        </div>
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
            <p className={`text-xl font-bold ${getTierColor(user.tier_name)}`}>
              {user.tier_name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Member Points</p>
            <p className="text-lg font-bold text-orange-600">{user.points_balance.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Miles Hit</p>
            <p className="text-lg font-bold text-red-600">{user.km_hit.toLocaleString()} km</p>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-bold text-black">{formatDateTime(user.join_date)}</p>
          </div>
        </div>

        <div className="border-t pt-3 text-center">
          <h3 className="text-lg font-bold mb-2">
            Contact Information
          </h3>

          <div className="space-y-1">
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Phone:</strong> {user.phone_number}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('purchase')}
          className="group bg-white rounded-xl shadow-lg p-6 min-w-[300px] min-h-[300px]
             transition-all duration-300 transform
             hover:-translate-y-1 hover:shadow-xl hover:bg-blue-600"
        >
          <ShoppingCart className="w-12 h-12 text-blue-600 mx-auto mb-3
               transition-colors duration-300
               group-hover:text-white" />
          <h3 className="text-xl font-bold text-gray-800 mb-1
               transition-colors duration-300
               group-hover:text-white">Book Flight</h3>
          <p className="text-sm text-gray-600
               transition-colors duration-300
               group-hover:text-blue-100">Search and purchase flight tickets</p>
        </button>

        <button
          onClick={() => onNavigate('redeem')}
          className="group bg-white rounded-xl shadow-lg p-6 min-w-[300px] min-h-[300px]
             transition-all duration-300 transform
             hover:-translate-y-1 hover:shadow-xl hover:bg-blue-600"
        >
          <Award className="w-12 h-12 text-blue-600 mx-auto mb-3 text-yellow-600
               transition-colors duration-300
               group-hover:text-white" />
          <h3 className="text-xl font-bold text-gray-800 mb-1
               transition-colors duration-300
               group-hover:text-white">Rewards</h3>
          <p className="text-sm text-gray-600
               transition-colors duration-300
               group-hover:text-blue-100">Redeem your points for rewards</p>
        </button>

        <button
          onClick={() => onNavigate('transactions')}
          className="group bg-white rounded-xl shadow-lg p-6 min-w-[300px] min-h-[300px]
             transition-all duration-300 transform 
             hover:-translate-y-1 hover:shadow-xl hover:bg-blue-600"
        >
          <History className="w-12 h-12 text-blue-600 mx-auto mb-3 text-gray-600
               transition-colors duration-300
               group-hover:text-white" />
          <h3 className="text-xl font-bold text-gray-800 mb-1
               transition-colors duration-300
               group-hover:text-white">Transactions</h3>
          <p className="text-sm text-gray-600
               transition-colors duration-300
               group-hover:text-blue-100">View your transaction history</p>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
