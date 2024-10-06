import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Ensure the CSS is linked here

const App = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [sortType, setSortType] = useState("marketCap"); // Sorting state

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        setCoins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the data:", error);
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  const handleSearch = (event) => {
    setSearchInput(event.target.value);
  };

  const sortCoins = (coins) => {
    if (sortType === "marketCap") {
      return [...coins].sort((a, b) => b.market_cap - a.market_cap);
    } else if (sortType === "percent") {
      return [...coins].sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );
    }
    return coins;
  };

  const filteredCoins = sortCoins(
    coins.filter((coin) =>
      coin.name.toLowerCase().includes(searchInput.toLowerCase())
    )
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Top 10 Cryptocurrencies by Market Cap</h1>

      <input
        type="text"
        placeholder="Search by name"
        value={searchInput}
        onChange={handleSearch}
      />

      <button onClick={() => setSortType("marketCap")}>
        Sort by Market Cap
      </button>
      <button onClick={() => setSortType("percent")}>Sort by % Change</button>

      <table className="crypto-table">
        <tbody>
          {filteredCoins.map((coin) => (
            <tr key={coin.id}>
              <td>
                <img src={coin.image} alt={coin.name} width="25" />
              </td>
              <td>{coin.name}</td>
              <td>{coin.symbol.toUpperCase()}</td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td
                style={{
                  color: coin.price_change_percentage_24h > 0 ? "green" : "red",
                }}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
