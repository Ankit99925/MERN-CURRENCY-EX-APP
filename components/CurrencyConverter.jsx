import { useRef, useState } from "react";
import CurrencySelector from "./CurrencySelector";
import axios from "axios";

const CurrencyConverter = () => {
  const amountInput = useRef();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(0);

  const convertHandler = async () => {
    try {
      const response = await axios.post("https://mern-currency-ex-app.onrender.com/api/convert", {
        amount: amountInput.current.value,
        sourceCurrency: fromCurrency,
        targetCurrency: toCurrency,
      });
      setConvertedAmount(response.data.targetCurrency.toFixed(2));
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-white">Currency Converter</h1>
      <div className="flex flex-col items-center space-y-4 bg-white p-4 rounded-lg shadow-inner">
        <input
          type="number"
          ref={amountInput}
          placeholder="Enter Amount to Convert"
          className="p-2 border border-gray-300 rounded-md"
        />
        <CurrencySelector
          label="From"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="w-full"
        />
        <CurrencySelector
          label="To"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="w-full"
        />
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={convertHandler}
        >
          Convert
        </button>
      </div>
      <div className="mt-4 text-2xl font-bold text-yellow-300 bg-gray-800 p-2 rounded-md">
        {convertedAmount} {toCurrency}
      </div>
    </div>
  );
};
export default CurrencyConverter;
