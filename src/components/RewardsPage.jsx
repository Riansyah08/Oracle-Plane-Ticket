import { React, useState, useEffect } from "react";
import { Award } from "lucide-react";
import { getTierColor,getbuttoncolour } from "../utils/helpers";
import { purchaseItem } from "../utils/fetch";
import { loginUser } from "../utils/fetch";

function RewardsPage({ user, onNavigate, setCurrentUser }) {
  const [allItems, setAllItems] = useState([]);
  const [hasAutoRedeemed, setHasAutoRedeemed] = useState(false);
  const [NotificationMsg, setNotificationMsg] = useState(false);
  const [NotificationLogin, setNotificationLogin] = useState(false);
  /* ---------------- Load ALL Items (once) ---------------- */
  const [refreshKey, setRefreshKey] = useState(0);
  const HOST = "10.143.191.86";
  const PORT = "3001";
  const BASE_URL = `http://${HOST}:${PORT}`;

const loadItems = async () => {
  try {
    const res = await fetch(BASE_URL + "/api/items");

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();

    setAllItems(data);
  } catch (err) {
    console.error("❌ ERROR:", err);
  }
};

useEffect(() => {
  loadItems();
}, [refreshKey]);

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
      setNotificationMsg("Insufficient points!");
      return;
    }

    if (
      tierOrder.indexOf(latestUser.tier_name) <
      tierOrder.indexOf(item.minTier)
    ) {
      setNotificationMsg(`Requires ${item.minTier} tier`);
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
    setNotificationMsg(`${item.name} redeemed successfully!`);

  } catch (err) {
    console.error(err);
    setNotificationMsg("Failed or delayed. Try again.");
  }
};

useEffect(() => {
  const autoRedeem = async () => {
    if (hasAutoRedeemed) return;
    if (!user?.user_id) return;
    const pending = localStorage.getItem("pendingRedeem");
    if (!pending) return;
    setHasAutoRedeemed(true);
    try {
      const parsed = JSON.parse(pending);
      localStorage.removeItem("pendingRedeem");
      await handleRedeemItem(parsed.item);
    } catch (err) {
      console.error("Auto purchase failed:", err);
    }
  };
  autoRedeem();
}, [user]);

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
            {user?.points_balance?.toLocaleString() ?? "0"}
          </span>
        </p>

        
        <div className="space-y-4 max-h-178 overflow-y-auto pr-2">
          {allItems.map((item, index) => (
            item.stock > 0 && (
            <div key={item.item_id ?? `${item.name}-${index}`} className="border rounded-lg p-5">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-lg">{item.name} ({item.item_id})</p>
                  <p className={`text-sm ${getTierColor(item.minTier)}`}>
                    {item.minTier} Tier
                  </p>
                  <p>{item.price} pts</p>
                  <p>{item.description}</p>
                  <p>Item Remaining: {item.stock}</p>
                </div>
                
                {NotificationMsg && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white border-1 rounded-xl shadow p-6 w-80 text-center ">
                      <p className="text-gray-800 mb-4">{NotificationMsg}</p>
                    <button
                    onClick={() => setNotificationMsg("")}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                    >
                      OK
                  </button>
                      </div>
                    </div>
                )}

                {/*Seat picker Login notification ah moment*/}
                  {NotificationLogin && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <div className="bg-white border-1 rounded-xl shadow-md p-6 w-80 text-center ">
                        <p className="text-gray-800 mb-4">{NotificationLogin}</p>
                      <button
                      onClick={() => {onNavigate("Login")}}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                      >
                        OK
                      </button>
                  </div>
                </div>
                )}

                <button
                  onClick={async () => {
                  if (!user?.user_id) {
                    localStorage.setItem("redirectAfterLogin", "redeem");
                    localStorage.setItem(
                      "pendingRedeem",
                      JSON.stringify({
                        item
                      })
                    );
                    setNotificationLogin("Please login first");
                    return;
                  }
                  
                  handleRedeemItem(item);}}
                  disabled={user?.points_balance < item.price || item.stock <= 0}
                  className={`${getbuttoncolour(user?.points_balance < item.points)} 
                  rounded-lg max-h-15 mt-8 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:bg-green-400 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-400`}
                >
                   Redeem
                </button>
              </div>
            </div>
            )
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
