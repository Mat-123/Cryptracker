import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Wallet = () => {
  const [cryptos, setCryptos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/v1/wallet')
      .then(res => setCryptos(res.data))
      .catch(error => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else if (error.response && error.response.status === 405) {
          navigate('/login');
        } else {
          console.error('An error occurred:', error);
        }
      });
  }, [navigate]);

  const calculateCryptoQuantities = (cryptos) => {
    const cryptoQuantities = {};
    const cryptoInfo = {}; // Store additional info like symbol
    const transactionCounts = {}; // Store the number of transactions

    cryptos.forEach(wallet => {
      const { id_crypto, name_crypto, transactions, symbol } = wallet;

      if (!cryptoQuantities[id_crypto]) {
        cryptoQuantities[id_crypto] = 0;
        cryptoInfo[id_crypto] = {
          name: name_crypto,
          symbol: symbol // Store the symbol of the crypto
        };
        transactionCounts[id_crypto] = 0;
      }

      let buyQuantity = 0;
      let sellQuantity = 0;

      transactions.forEach(transaction => {
        const quantity = parseFloat(transaction.quantity);
        if (!isNaN(quantity)) {
          if (transaction.transaction_type === 0) { // Buy
            buyQuantity += quantity;
          } else if (transaction.transaction_type === 1) { // Sell
            sellQuantity += quantity;
          }
          transactionCounts[id_crypto]++;
        }
      });

      // Calculate net quantity
      cryptoQuantities[id_crypto] = buyQuantity - sellQuantity;
    });

    return { cryptoQuantities, cryptoInfo, transactionCounts };
  };

  const calculateTotalValues = (cryptos, cryptoQuantities) => {
    const totalValues = {};

    cryptos.forEach(wallet => {
      const { id_crypto, last_value } = wallet;
      const totalValue = cryptoQuantities[id_crypto] * last_value;
      totalValues[id_crypto] = totalValue.toFixed(2); // Round to 2 decimal places
    });

    return totalValues;
  };

  const { cryptoQuantities, cryptoInfo, transactionCounts } = calculateCryptoQuantities(cryptos);
  const totalValues = calculateTotalValues(cryptos, cryptoQuantities);

  return (
    <>
    <div className="col-2">

    </div>
    <div className="col-8">
    <div className="text-white mt-5">
      <h1>My Crypto Wallet</h1>
        {Object.entries(cryptoQuantities).map(([id_crypto, quantity]) => (
          <div className="card card-bg-color text-white my-3 rounded-4" key={id_crypto}>
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
            {cryptoInfo[id_crypto].name}: {quantity} {cryptoInfo[id_crypto].symbol} - Total Value: {totalValues[id_crypto]} USD - Total Transactions: {transactionCounts[id_crypto]}
            </div>
            <div>
            <Link to={`/transactions/${id_crypto}`}>
              <button className="btn manage-btn rounded-3">Manage</button>
            </Link>
            </div>
          </div>
          </div>
        ))}
    </div>
    </div>
    </>
  );
}

export default Wallet;
