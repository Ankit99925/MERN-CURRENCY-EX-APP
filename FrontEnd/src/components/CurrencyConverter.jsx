import { useRef, useState, useEffect } from "react";
import CurrencySelector from "./CurrencySelector";
import axios from "../config/axiosInstance";

const CurrencyConverter = () => {
  const amountInput = useRef();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("conversionHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("conversionHistory", JSON.stringify(history));
  }, [history]);

  const convertHandler = async () => {
    const amount = amountInput.current.value;
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/convert", {
        amount,
        sourceCurrency: fromCurrency,
        targetCurrency: toCurrency,
      });

      const result = response.data.targetCurrency.toFixed(2);
      setConvertedAmount(result);

      // Add to history
      const newEntry = {
        id: Date.now(),
        amount,
        fromCurrency,
        toCurrency,
        result,
        date: new Date().toLocaleString()
      };

      setHistory(prev => [newEntry, ...prev.slice(0, 4)]); // Keep only last 5 conversions
    } catch (error) {
      setError("Failed to convert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-indigo-500 to-purple-600">
          <h1 className="text-3xl font-bold text-white text-center">Currency Converter</h1>
          <p className="text-blue-100 text-center mt-1">Fast and reliable exchange rates</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                ref={amountInput}
                placeholder="Enter amount"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <CurrencySelector
                  label="From"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                />
              </div>

              <div className="pt-5">
                <button
                  onClick={swapCurrencies}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>

              <div className="flex-1">
                <CurrencySelector
                  label="To"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                />
              </div>
            </div>

            <button
              className="w-full px-6 py-3 text-white font-medium bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              onClick={convertHandler}
              disabled={loading}
            >
              {loading ? "Converting..." : "Convert"}
            </button>

            {convertedAmount !== null && (
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <p className="text-center text-gray-600">Result:</p>
                <div className="text-center text-2xl font-bold text-indigo-700 mt-1">
                  {amountInput.current?.value || "0"} {fromCurrency} = {convertedAmount} {toCurrency}
                </div>
              </div>
            )}

            {/* History Section */}
            {history.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Recent Conversions</h3>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {history.map((item) => (
                    <div key={item.id} className="py-3">
                      <div className="flex justify-between">
                        <span className="text-gray-800">{item.amount} {item.fromCurrency} → {item.result} {item.toCurrency}</span>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
