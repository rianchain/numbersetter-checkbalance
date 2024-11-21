import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function App() {

  const [balance, setBalance] = useState(null);
  const [contractAddress, setContractAddress] = useState('');

  const getBalance = async () => {
  try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ETHEREUM_SEPOLIA_RPC_URL);
      const balance = await provider.getBalance(contractAddress);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  return (
    <div className="App">
      <h1>Check ETH Balance</h1>
      <input
        type="text"
        placeholder="Enter contract address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <button onClick={getBalance}>Get Balance</button>
      {balance && (
        <div>
          <h2>Balance:</h2>
          <p>{balance} ETH</p>
        </div>
      )}
    </div>
  );
}

export default App;
