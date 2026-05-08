import { React, useState, useEffect } from "react";
import { Award } from "lucide-react";
import { getTierColor,getbuttoncolour } from "../utils/helpers";
import { purchaseItem } from "../utils/fetch";
import { loginUser } from "../utils/fetch";

function RewardsPage({ user, rewardItems, setCurrentUser }) {
  const [allItems, setAllItems] = useState([]);
  /* ---------------- Load ALL Items (once) ---------------- */
  const [refreshKey, setRefreshKey] = useState(0);

useEffect(() => {
  const loadItems = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/items");

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      if (!data || data.length === 0) {
        setCurrentUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("lastActivity");
        
        alert("Redeem Points Page is in Maintenance Right Now");
        return;
      }

      setAllItems(data);
    } catch (err) {
      console.error("❌ ERROR:", err);
    }
  };

  loadItems();
}, [refreshKey]); // only for items

const waitForUpdatedUser = async (email, password, oldPoints) => {
  for (let i = 0; i < 5; i++) {
    const updated = await loginUser({ email, password });

    if (updated.points_balance !== oldPoints) {
      return updated; // ✅ updated
    }

    await new Promise(res => setTimeout(res, 400));
  }

  throw new Error("User not updated yet");
};

const handleRedeemItem = async (item) => {
  try {
    const latestUser = await loginUser({
      email: user.email,
      password: user.password,
    });

    const oldPoints = latestUser.points_balance;

    const tierOrder = ["Silver", "Gold", "Platinum"];

    if (oldPoints < item.price) {
      alert("Insufficient points!");
      return;
    }

    if (
      tierOrder.indexOf(latestUser.tier_name) <
      tierOrder.indexOf(item.minTier)
    ) {
      alert(`Requires ${item.minTier} tier`);
      return;
    }

    // 🔥 STEP 1: do transaction
    await purchaseItem({
      email: latestUser.email,
      password: latestUser.password,
      itemId: item.item_id,
      amount: 1,
    });

    // 🔥 STEP 2: WAIT until backend updates
    const updatedUser = await waitForUpdatedUser(
      latestUser.email,
      latestUser.password,
      oldPoints
    );

    // 🔥 STEP 3: update state (THIS updates UI)
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // 🔥 STEP 4: refresh items
    setRefreshKey(prev => prev + 1);
    alert(`${item.name} redeemed successfully!`);

  } catch (err) {
    console.error(err);
    alert("Failed or delayed. Try again.");
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
                  <p>{item.description}</p>
                  <p>Item Remaining: {item.stock}</p>
                </div>
                
                <button
                  onClick={() => handleRedeemItem(item)}
                  disabled={user.points_balance < item.price || item.stock <= 0}
                  className={`${getbuttoncolour(user.points_balance < item.points)} 
                  rounded-lg max-h-15 mt-8 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:bg-green-400 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-400`}
                >
                   Redeem
                </button>
              </div>
            </div>
          ))}

          {allItems.length === 0 && (
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
