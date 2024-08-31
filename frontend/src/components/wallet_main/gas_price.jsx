import { useState, useEffect } from "react";
import "../styles/WalletInfo.css";
import axios from "axios";

const GetGasPrice = () => {
  // Changed component name to start with a capital letter
  const [gasPrice, setGasPrice] = useState(); // Fixed the typo in the state variable name
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const response = await axios.get("https://roflstudios.com/api/get_gas");
        setGasPrice(response.data);
      } catch (error) {
        setError("Error getting gas price: " + error);
      }
    };

    fetchGasPrice(); // Fetch gas price on initial render

    const intervalId = setInterval(() => {
      fetchGasPrice(); // Fetch gas price every 5 seconds
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="Gas-Container">
      <h1>Proposed Gas Amounts</h1>
      <div className="Low">
        <h2>😁 Low</h2>
        <h3>
          {gasPrice
            ? parseFloat(gasPrice.SafeGasPrice).toFixed(2)
            : "Loading..."}{" "}
          gwei
        </h3>
      </div>
      <div className="Average">
        <h2>😄 Average</h2>
        <h3>
          {gasPrice
            ? parseFloat(gasPrice.ProposeGasPrice).toFixed(2)
            : "Loading..."}{" "}
          gwei
        </h3>
      </div>
      <div className="High">
        <h2>🙂 High</h2>
        <h3>
          {gasPrice
            ? parseFloat(gasPrice.FastGasPrice).toFixed(2)
            : "Loading..."}{" "}
          gwei
        </h3>
      </div>
      {error && <div className="error">{error}</div>}{" "}
      {/* Display error if it exists */}
    </div>
  );
};

export default GetGasPrice; // Ensure the component name is correctly exported
