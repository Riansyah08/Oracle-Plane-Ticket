import React from "react";
import { Award } from "lucide-react";
import { getTierColor,getbuttoncolour } from "../utils/helpers";
import { purchaseItem } from "../utils/fetch";

function RewardsPage({ user, rewardItems, updateUser }) {
  const handleRedeemItem = async (item) => {
    const tierOrder = ["Silver", "Gold", "Platinum"];

    if (user.points_balance < item.points) {
      alert("Insufficient points balance!");
      return;
    }
    if (
      tierOrder.indexOf(user.tier_name) <
      tierOrder.indexOf(item.tier)
    ) {
      alert(`This reward requires ${item.tier} tier or higher!`);
      return;
    }

    const prevPoints = user.points_balance;

    // optimistic UI update
    updateUser({
      ...user,
      points_balance: user.points_balance - item.points
    });

    try {
      await purchaseItem({
        email: user.email,
        password: user.password,
        itemId: item.id,
        amount: 1
      });

      alert(`${item.name} redeemed successfully!`);
    } catch (err) {
      updateUser({ ...user, points_balance: prevPoints });
      alert("Redemption failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Award className="w-7 h-7 mr-2 text-yellow-600" />
          Redeem Rewards
        </h2>

        <p className="mb-6 text-gray-600">
          Points:{" "}
          <span className="font-bold text-purple-600">
            {user.points_balance.toLocaleString()}
          </span>
        </p>

        <div className="space-y-4 max-h-178 overflow-y-auto pr-2">
          {rewardItems.map(item => (
            <div key={item.id} className="border rounded-lg p-5">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className={`text-sm ${getTierColor(item.tier)}`}>
                    {item.tier} Tier
                  </p>
                  <p>{item.points} pts</p>
                </div>

                <button
                  onClick={() => handleRedeemItem(item)}
                  className={`${getbuttoncolour(user.points_balance < item.points)} rounded-lg max-h-15 font-semibold`}
                >
                   Redeem
                </button>
              </div>
            </div>
          ))}

          {rewardItems.length === 0 && (
            <p className="text-center text-gray-500">
              No rewards available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RewardsPage;
