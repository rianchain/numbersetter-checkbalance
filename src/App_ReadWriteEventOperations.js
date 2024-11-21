import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from './contract_abi.json';

function App() {

  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const CONTRACT_ADDRESS = '0x51eAF6F84C21e7297C5CFc17Cfd0fBb4e513fbC8';
  const [contract, setContract] = useState(null);
  const [number, setNumber] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [events, setEvents] = useState([]);

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

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    setContract(contract);

    const fetchNumber = async () => {
      const number = await contract.number();
      setNumber(number.toNumber());
    }

    fetchNumber();

  }, []);

  useEffect(() => {

    const subscribeToEvents = async () => {
      if (contract) {
        contract.on('NumberSet', (arg1) => {
          const numberValue = arg1.toString();
          setEvents((prevEvents) => [...prevEvents, { numberValue }]);
        });
      }
    };

    subscribeToEvents();

    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, [contract]);

  const getBalance = async () => {
  try {
      const balance = await provider.getBalance(walletAddress);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const incrementNumber = async () => {
    if (contract) {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const tx = await contractWithSigner.increment();
        await tx.wait();
        setNumber(number + 1);
      } catch (error) {
        console.error('Error incrementing number:', error);
      }
    }
  };

  const decrementNumber = async () => {
    if (contract) {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const tx = await contractWithSigner.decrement();
        await tx.wait();
        setNumber(number - 1);
      } catch (error) {
        console.error('Error decrementing number:', error);
      }
    }
  };

  const handleSetNumber = async () => {
    if (contract) {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const tx = await contractWithSigner.setNumber(parseInt(inputValue));
        await tx.wait();
        setNumber(parseInt(inputValue));
        setInputValue('');
      } catch (error) {
        console.error('Error setting number:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Check ETH Balance</h1>
      <h3>Connected Wallet Address:</h3>
      <p>{ walletAddress }</p>
      <button onClick={getBalance}>Get Balance</button>
      {balance && (
        <div>
          <h2>Balance:</h2>
          <p>{balance} ETH</p>
        </div>
      )}
      <hr />
      <h3>Smart Contract Address:</h3>
      <p>{ contract && contract.address }</p>
      <p>Number: { number }</p>
      <div>
        <button onClick={incrementNumber}>Increment</button> <button onClick={decrementNumber}>Decrement</button>
      </div>
      <br />
      <div>
        <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Enter number" 
          />
          <button onClick={handleSetNumber}>Set Number</button>
      </div>
      <h4>NumberSet Events</h4>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event.numberValue}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
