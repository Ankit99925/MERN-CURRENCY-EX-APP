const exchangeRateService = require("../Service/exchangeRateService");

exports.convertCurrency = (req, res, next) => {
  const { amount, sourceCurrency, targetCurrency } = req.body;
  if (!amount || !sourceCurrency || !targetCurrency) {
    return res
      .status(400)
      .json({ status: "failed", message: "Required fields are missing" });
  }
  const targetAmount = exchangeRateService.convert(
    amount,
    sourceCurrency,
    targetCurrency
  );
  res.json({ status: "success", targetCurrency: targetAmount });
};
