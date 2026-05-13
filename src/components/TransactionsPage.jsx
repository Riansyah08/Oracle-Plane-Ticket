import React, { useEffect, useState } from "react";
import { History } from "lucide-react";
import { Transactionlog } from "../utils/fetch";

function TransactionsPage({ user, rewardItems }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.password || !user?.email) return;

    setLoading(true);
    setError(null);

    Transactionlog({
      email: user.email,
      password: user.password // ✅ FIXED
    })
      .then(data => {
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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
      });
  };

const formatDescription = (desc) => {
  const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[+-]\d{2}:\d{2}/g;

  return desc.replace(regex, (match) => {
    const d = new Date(match);

    // ONLY format date (no time)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  });
};

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <History className="w-7 h-7 mr-2 text-gray-600" />
          Transaction History
        </h2>

        <div className="space-y-4 max-h-220 overflow-y-auto pr-2">
          {sortedTransactions.length === 0 && (
            <p className="text-gray-500 text-center">
              No transactions found
            </p>
          )}

          {sortedTransactions.map(tx => {
            const isBuyTicket = tx.type === "BUY TICKET"  
            const matchedItem = rewardItems.find(
              item => item.name === tx.item_name
            );
            const displayPoints = isBuyTicket ? 3000 : matchedItem?.points ?? Math.abs(tx.points);
            return (
            <div
              key={tx.id}
              className="border rounded-lg p-5 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex-1">
                  <p className="font-bold text-lg">{tx.type}</p>
                  {!tx.ticket_id ? (
                    <p className="text-gray-600">{formatDescription(tx.description)}</p>
                  ) : (
                    <p className="text-gray-600">Ticket ID: {tx.ticket_id}. Plane {formatDescription(tx.description)}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(tx.date).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      isBuyTicket ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isBuyTicket ? "+" : "Remaining "}
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
          )})}
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;