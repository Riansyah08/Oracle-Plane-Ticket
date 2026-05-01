import { React, useState, useEffect } from "react";
import { Award } from "lucide-react";
import { getTierColor,getbuttoncolour } from "../utils/helpers";
import { purchaseItem } from "../utils/fetch";
import { loginUser } from "../utils/fetch";

function RewardsPage({ user, rewardItems, setCurrentUser }) {
  const [allItems, setAllItems] = useState([]);
  /* ---------------- Load ALL Items (once) ---------------- */
  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/items");
      
        if (!res.ok) throw new Error("Failed");
      
        const data = await res.json();
      
        console.log("ALL Items:", data);
      
        setAllItems(data);
      
      } catch (err) {
        console.error("❌ ERROR:", err);
      }
    };
  
    loadItems();
  }, []);

  const handleRedeemItem = async (item) => {
    const tierOrder = ["Silver", "Gold", "Platinum"];

    if (user.points_balance < item.points || user.points_balance === undefined) {
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

    try {
      await purchaseItem({
        email: user.email,
        password: user.password,
        itemId: item.item_id,
        amount: 1
      });
 
      const freshUser = await loginUser({
          email: user.email,
          password: user.password,
        });
      // 🔥 replace global state
      setCurrentUser(freshUser);
      alert(`${item.name} redeemed successfully!`);

    } catch (err) {
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
            {user.points_balance?.toLocaleString() ?? "0"}
          </span>
        </p>

        <div className="space-y-4 max-h-178 overflow-y-auto pr-2">
          {allItems.map(item => (
            <div key={item.item_id} className="border rounded-lg p-5">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className={`text-sm ${getTierColor(item.minTier)}`}>
                    {item.minTier} Tier
                  </p>
                  <p>{item.price} pts</p>
                  <p>Item Remaining: {item.stock}</p>
                </div>
                
                <button
                  onClick={() => handleRedeemItem(item)}
                  className={`${getbuttoncolour(user.points_balance < item.points)} rounded-lg max-h-15 mt-5 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:bg-green-400`}
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
