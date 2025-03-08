import currencies from "../util/currencies";

const CurrencySelector = ({ label, value, onChange }) => {
  return (
    <div>
      <label htmlFor="">{label}</label>
      <select
        name="sourceCurrency"
        id="sourceCurrency"
        value={value}
        onChange={onChange}
      >
        {Object.keys(currencies).map((currency) => (
          <option key={currency} value={currency}>
            {currencies[currency].name} -{currencies[currency].flag}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
