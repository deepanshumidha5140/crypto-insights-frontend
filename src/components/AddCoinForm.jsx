import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

export default function AddCoinForm({ onSuccess, showToast }) {
  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [validCoins, setValidCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coinLoading, setCoinLoading] = useState(true);

  // Fetch coin list on mount
  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/coins`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setValidCoins(data);
          setCoinId(data[0]); // Set default selection
        } else {
          showToast("No valid coins available", "error");
        }
      } catch {
        showToast("Failed to fetch valid coins", "error");
      } finally {
        setCoinLoading(false);
      }
    }

    fetchCoins();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coinId || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/portfolio/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coin_id: coinId,
          amount: parseFloat(amount),
        }),
      });

      const data = await res.json();

      if (res.ok && !data.error) {
        showToast("Coin added successfully", "success");
        setAmount("");
        onSuccess();
      } else {
        showToast(data.error || "Failed to add coin.", "error");
      }
    } catch {
      showToast("Server error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Add Coin to Portfolio
        </h2>
      </div>

      <div className="space-y-4">
        {coinLoading ? (
          <p className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
            Loading coin list...
          </p>
        ) : (
          <select
            id="coin-select"
            aria-label="Select coin"
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            {validCoins.map((coin) => (
              <option key={coin} value={coin}>
                {coin
                  .split("-")
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          min="0"
          step="any"
          id="coin-amount"
          aria-label="Enter coin amount"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />

        <button
          type="submit"
          disabled={loading || coinLoading || !coinId || !amount}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition disabled:opacity-50 shadow"
        >
          {loading ? "Adding..." : "Add to Portfolio"}
        </button>
      </div>
    </form>
  );
}