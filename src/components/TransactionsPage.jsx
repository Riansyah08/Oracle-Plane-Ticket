import React from 'react';
import { History } from 'lucide-react';

function TransactionsPage({ user, transactions }) {
  const userTransactions = transactions
    .filter(t => t.user_id === user.user_id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <History className="w-7 h-7 mr-2 text-gray-600" />
          Transaction History
        </h2>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {userTransactions.map(transaction => (
            <div key={transaction.id} className="border rounded-lg p-5 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex-1">
                  <p className="font-bold text-lg">{transaction.type}</p>
                  <p className="text-gray-600">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                  </p>
                  {transaction.amount > 0 && (
                    <p className="text-gray-600">${transaction.amount}</p>
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
