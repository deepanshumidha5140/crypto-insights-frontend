import { useEffect, useState, useRef } from "react";
import AddCoinForm from "../components/AddCoinForm";
import RemoveCoinForm from "../components/RemoveCoinForm";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioPieChart from "../components/PortfolioPieChart";
import ThemeToggle from "../components/ThemeToggle";
import { DollarSign, RotateCw, CheckCircle, XCircle } from "lucide-react";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioCoins, setPortfolioCoins] = useState([]);
  const [toast, setToast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshType, setRefreshType] = useState(null);
  const toastTimerRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchPortfolio = async (showSuccessToast = false, type = null) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? ""}/portfolio`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      setPortfolio(data);

      const coins = Object.keys(data).filter(k => k !== "total_portfolio_value");
      setPortfolioCoins(coins);

      if (type) {
        setLastUpdated(new Date());
        setRefreshType(type);
      }

      if (showSuccessToast) showToast("Prices updated successfully");
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      showToast("Failed to fetch portfolio", "error");
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 1500);
  };

  useEffect(() => {
    fetchPortfolio(false); // Initial fetch on mount

    intervalRef.current = setInterval(() => {
      fetchPortfolio(false, "auto");
    }, 10 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-light dark:text-brand-dark tracking-tight">
          Crypto Insights Dashboard
        </h1>
        <ThemeToggle />
      </div>

      {/* Forms */}
      <div className="grid sm:grid-cols-2 gap-6">
        <AddCoinForm onSuccess={fetchPortfolio} showToast={showToast} />
        <RemoveCoinForm
          onSuccess={fetchPortfolio}
          showToast={showToast}
          portfolioCoins={portfolioCoins}
        />
      </div>

      {/* Manual Refresh */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={() => fetchPortfolio(true, "manual")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
        >
          <RotateCw className="w-4 h-4" />
          Refresh Prices
        </button>
      </div>

      {/* Last Updated Timestamp */}
      {lastUpdated && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-right">
          Last {refreshType === "manual" ? "manual" : "auto"} refresh:{" "}
          {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Portfolio Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio &&
          Object.entries(portfolio).map(([coin, data]) =>
            coin === "total_portfolio_value" ? null : (
              <PortfolioCard key={coin} coin={coin} data={data} />
            )
          )}
      </div>

      {/* Pie Chart */}
      {portfolio && (
        <div className="mt-12">
          <PortfolioPieChart portfolio={portfolio} />
        </div>
      )}

      {/* Total Portfolio Value */}
      {portfolio && (
        <div className="mt-10 p-6 rounded-xl bg-white dark:bg-gray-800 shadow text-center border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-6 h-6" />
            Total Portfolio Value: ${portfolio.total_portfolio_value}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in ${
            toast.type === "error"
              ? "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
              : "bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100"
          }`}
          role="alert"
          aria-live="assertive"
        >
          {toast.type === "error" ? (
            <XCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-400 dark:text-gray-500">
        Built with 💙 using React, Tailwind, Recharts & FastAPI
      </footer>
    </div>
  );
}