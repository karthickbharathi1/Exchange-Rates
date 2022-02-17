import { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";
const BASE_URL =
  // "http://api.exchangeratesapi.io/v1/latest?access_key=a93cc6444d63a20ec7553146cfce5da8"
  "https://api.exchangerate.host/latest";
function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [frontCurrency, setFrontCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountFromCurrency] = useState(true);
  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        console.log(data.rates);
        setFrontCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
        console.log(data.rates[firstCurrency]);
        console.log(exchangeRate);
        console.log(Object.keys(data.rates));
      });
  }, []);
  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountFromCurrency(true);
  }
  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountFromCurrency(false);
  }
  useEffect(() => {
    if (frontCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL} ?base=${frontCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.rates[toCurrency]));
    }
  }, [frontCurrency, toCurrency]);
  return (
    <div>
      <div className="name">

      </div>
      <div className="center">
        <h1>Convert</h1>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={frontCurrency}
          onChangeCurrency={(e) => setFrontCurrency(e.target.value)}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />
        <div className="equals">=</div>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          amount={toAmount}
          onChangeAmount={handleToAmountChange}
        />
      </div>
    </div>
  );
}

export default App;
