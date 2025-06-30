import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function RemoveCoinForm({ onSuccess, showToast, portfolioCoins }) {
  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (portfolioCoins.length > 0) {
      setCoinId((prev) =>
        portfolioCoins.includes(prev) ? prev : portfolioCoins[0]
      );
    } else {
      setCoinId("");
    }
  }, [portfolioCoins]);

  const handleRemove = async (e) => {
    e.preventDefault();

    const amt = parseFloat(amount);
    if (!coinId || isNaN(amt) || amt <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/portfolio/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coin_id: coinId.toLowerCase(),
          amount: amt,
        }),
      });

      const data = await res.json();

      if (res.ok && !data.error) {
        showToast("Coin amount removed successfully", "success");
        setAmount("");
        onSuccess(); // trigger parent refresh
      } else {
        showToast(data.error || "Failed to remove coin.", "error");
      }
    } catch {
      showToast("Server error. Try again.", "error");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleRemove}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Remove Coin from Portfolio
        </h2>
      </div>

      <div className="space-y-4">
        {portfolioCoins.length > 0 ? (
          <>
            <select
              id="remove-coin-select"
              aria-label="Select coin to remove"
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              {portfolioCoins.map((coin) => (
                <option key={coin} value={coin}>
                  {coin
                    .split("-")
                    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>

            <input
              type="number"
              id="remove-coin-amount"
              aria-label="Amount to remove"
              min="0"
              step="any"
              placeholder="Enter amount to remove"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition disabled:opacity-50 shadow"
            >
              {loading ? "Removing..." : "Remove Coin"}
            </button>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400" aria-live="polite">
            No coins in portfolio.
          </p>
        )}
      </div>
    </form>
  );
}