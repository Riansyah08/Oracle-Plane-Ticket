import React from 'react';
import { Award } from 'lucide-react';
import { getTierColor } from '../utils/helpers';
import {purchaseItem} from '../utils/fetch.js';

function RewardsPage({ user, rewardItems, updateUser}) {
  const handleRedeemItem = (item) => {
    if (user.points_balance >= item.points) {
      const tierOrder = ['Silver', 'Gold', 'Platinum'];
      if (tierOrder.indexOf(user.account_tier) >= tierOrder.indexOf(item.tier)) {
        const updatedUser = {
          ...user,
          points_balance: user.points_balance - item.points
        };
        updateUser(updatedUser);
        
        const newTransaction = {
          id: `T${String(Math.random()).substring(2, 8)}`,
          user_id: user.user_id,
          type: 'Reward Redemption',
          description: item.name,
          points: -item.points,
          date: new Date().toISOString().split('T')[0],
          amount: 0
        };
        purchaseItem(newTransaction) ;
        alert(`${item.name} redeemed successfully!`);
      } else {
        alert(`This reward requires ${item.tier} tier or higher!`);
      }
    } else {
      alert('Insufficient points balance!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Award className="w-7 h-7 mr-2 text-yellow-600" />
          Redeem Rewards
        </h2>
        <p className="mb-2 text-gray-600">Your current tier: <span className={`font-bold ${getTierColor(user.account_tier)}`}>{user.account_tier}</span></p>
        <p className="mb-6 text-gray-600">Available points: <span className="font-bold text-purple-600">{user.points_balance.toLocaleString()}</span></p>

        <div className="space-y-4 max-h-170 overflow-y-auto pr-2">
          {rewardItems.map(item => {
            const tierOrder = ['Silver', 'Gold', 'Platinum'];
            const canRedeem = tierOrder.indexOf(user.account_tier) >= tierOrder.indexOf(item.tier);
            
            return (
              <div key={item.id} className={`border rounded-lg p-5 ${!canRedeem ? 'opacity-50' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-xl mb-1">{item.name}</p>
                    <p className="text-gray-600">Category: {item.category}</p>
                    <p className={`text-sm ${getTierColor(item.tier)}`}>Requires: {item.tier} Tier</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600 mb-2">{item.points} pts</p>
                    <button
                      onClick={() => handleRedeemItem(item)}
                      disabled={!canRedeem}
                      className={`px-6 py-2 rounded transition font-semibold ${
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
  );
}

export default RewardsPage;
