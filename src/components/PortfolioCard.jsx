import { Coins } from "lucide-react";

export default function PortfolioCard({ coin, data }) {
  const { amount, price, value_usd } = data;

  const formattedCoin = coin
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const displayPrice =
    typeof price === "number" ? `$${price.toFixed(2)}` : "Not available";

  const displayValue =
    typeof value_usd === "number" ? `$${value_usd.toFixed(2)}` : "$0.00";

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col gap-2"
      role="region"
      aria-label={`Portfolio card for ${formattedCoin}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">
          {formattedCoin}
        </h3>
        <Coins className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Holdings:{" "}
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {amount}
        </span>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Price:{" "}
        <span className="text-blue-600 dark:text-blue-400">{displayPrice}</span>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Value:{" "}
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          {displayValue}
        </span>
      </div>
    </div>
  );
}