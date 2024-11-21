import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from './contract_abi.json';
import CustomAlert from './CustomAlert.js';

function App() {

  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  // owner contract address = 0x6482f9C2E181F21Ebafc6f7070462BFdBf34C50B
  const CONTRACT_ADDRESS = '0x7Ce74F94B71A934eb63d684af32C41DC639A34ef';
  const [contract, setContract] = useState(null);
  const [number, setNumber] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const handleAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

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
        if (number >= 10) {
          handleAlert(
            'error', 
            'Anda tidak bisa menggunakan fungsi increment karena number sudah mencapai limit yaitu 10.'
          );
          return;
        }

        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const tx = await contractWithSigner.increment();
        await tx.wait();
        setNumber(number + 1);
      } catch (error) {
        if (error.code === 'ACTION_REJECTED') {
          handleAlert(
            'warning', 
            'Transaksi dibatalkan: Anda menolak konfirmasi di MetaMask'
          );
        } else {
          handleAlert(
            'error', 
            'Terjadi kesalahan saat melakukan increment'
          );
        }
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
      <div className="address-container">
        <div className="address-text wallet-address">
          {walletAddress || 'Wallet tidak terkoneksi'}
        </div>
      </div>
      <button onClick={getBalance}>Get Balance</button>
      {balance && (
        <div>
          <h2>Balance:</h2>
          <p>{balance} ETH</p>
        </div>
      )}
      <hr />
      <h1>Number setter</h1>
      <div className="address-container">
        <div className="address-text contract-address">
          {contract && contract.address}
        </div>
      </div>
      <p>Number: {number}</p>
      <div>
        <button onClick={incrementNumber}>Increment</button>
        <button onClick={decrementNumber}>Decrement</button>
      </div>
      <br />
      <div>
        <input 
          type="number" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Enter number" 
        />
        <button onClick={handleSetNumber}>Set Number</button>
        {showAlert && (
          <CustomAlert
            type={alertType}
            message={alertMessage}
            onClose={closeAlert}
          />
        )}
      </div>
    </div>
  );
}

export default App;
