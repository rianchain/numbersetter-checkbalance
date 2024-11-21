import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function App() {

  const [balance, setBalance] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const getWalletAddress = async() => {
    try {
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();

      const address = await signer.getAddress();
      console.log("Connected wallet address:", address);

      return address;
    } catch (error) {
      console.error("Error requesting account access or getting address:", error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const address = await getWalletAddress();
      setWalletAddress(address);
    };

    fetchWalletAddress();
  }, []);

  const getBalance = async () => {
  try {
      const balance = await provider.getBalance(walletAddress);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  return (
    <div className="App">
      <h1>Check ETH Balance</h1>
      <div>Wallet: { walletAddress }</div>
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
