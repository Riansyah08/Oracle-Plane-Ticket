import React, { useEffect, useState } from "react";
import { History } from "lucide-react";
import { Transactionlog } from "../utils/fetch";

function TransactionsPage({ user, tx }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isBuyTicket = tx.type === "BUY TICKET";
  const displayPoints = isBuyTicket ? 100 : tx.points;

  useEffect(() => {
    if (!user?.user_id || !user?.email) return;

    setLoading(true);
    setError(null);

    Transactionlog({
      userAccID: user.user_id, // ✅ FIXED
      email: user.email
    })
      .then(data => {
        console.log("Fetched transactions:", data); // debug
        setTransactions(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || "Failed to load transactions");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <p className="text-center">Loading transactions...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <History className="w-7 h-7 mr-2 text-gray-600" />
          Transaction History
        </h2>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {sortedTransactions.length === 0 && (
            <p className="text-gray-500 text-center">
              No transactions found
            </p>
          )}

          {sortedTransactions.map(tx => (
            <div
              key={tx.id}
              className="border rounded-lg p-5 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex-1">
                  <p className="font-bold text-lg">{tx.type}</p>
                  <p className="text-gray-600">{tx.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.date).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      isBuyTicket ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isBuyTicket ? "+" : "-"}
                    {displayPoints} pts
                  </p>

                  {tx.amount > 0 && (
                    <p className="text-gray-600">
                      Rp {tx.amount.toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;