import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Notifications from "./TransactionDetails";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(0);
  const [estimatedGasPrice, setEstimatedGasPrice] = useState();
  const [hasMetamask, setHasMetamask] = useState(false);

  useEffect(() => {
    if (window.ethereum) setHasMetamask(true); // If metamask installed set it to true

    window.localStorage.setItem("address", address);
    window.localStorage.setItem("details", "{ name: 'james' }");
  }, [address]);

  // Handle bulk events using one useState hook, set initial values
  const initialValues = {
    address: "",
    amount: "",
  };
  // Pass the initail value to a hook
  const [values, setValues] = useState(initialValues);
  // Making a one time handle change

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(e.target);
    setValues({ ...values, [name]: value });
    // const formattedAmount = ethers.utils.parseUnits(values.amount, 6);
    // console.log(values, formattedAmount._hex);
    // transferToken(values.address, values.amount)
  };
  // const {ethereum} = window
  const usdc = {
    address: "0x68ec573C119826db2eaEA1Efbfc2970cDaC869c4",
    abi: [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function gimmeSome() external",
      "function balanceOf(address _owner) public view returns (uint256 balance)",
      "function transfer(address _to, uint256 _value) public returns (bool success)",
    ],
  };

  const getContract = async () => {
    try {
      if (!hasMetamask) {
        console.log("Pls install Metamask");
      }
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      // await provider.send("eth_requestAccounts", []);
      const gas = provider.getGasPrice();
      setEstimatedGasPrice(gas);
      const signer = provider.getSigner();
      const usdcContract = await new ethers.Contract(
        usdc.address,
        usdc.abi,
        signer
      );
      return usdcContract;
    } catch (error) {
      console.log(error);
    }
  };
  // Transfer Fake USDC from one address to another
  const transferToken = async () => {
    try {
      // const formattedAmount = ethers.utils.parseUnits("1", 6);
      const { address, amount } = values;
      const formattedAmount = amount * Math.pow(10, 6);
      console.log(formattedAmount);
      const usdcContract = await getContract();
      const txn = await usdcContract.transfer(
        // "0xccA6BBb221c3195BdB56F07f720752db000B1E3A",
        address,
        formattedAmount,
        // "10",
        { gasPrice: 52399666204 }
      );
      console.log(txn.hash);
    } catch (e) {
      console.log(e);
      setMessage(e.message);
    }
  };

  const connectWallet = async () => {
    // connect to Metamask

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(`Your connected wallet is: ${ethereum.selectedAddress}`);
    let userAddress = await signer.getAddress();
    //console.log(userAddress)
    setAddress(userAddress);
    const usdcContract = await getContract();
    const bal = await usdcContract.balanceOf(
      address.toString()
    ); // returns a hex in 6 decimals
    // const usdcBal = ethers.utils.formatUnits(balanceUS, 6); // format usdc bal from wei to decimal
    setBalance(ethers.utils.formatUnits(bal, 6));
  };
  const getUsdcDetails = async () => {
    try {
      const usdcContract = await getContract();
      // const name = await usdcContract.name; // Get name
      // const sym = await usdcContract.symbol; // get symbol

      const bal = await usdcContract.balanceOf(
        "0xccA6BBb221c3195BdB56F07f720752db000B1E3A"
      ); // returns a hex in 6 decimals
      // const usdcBal = ethers.utils.formatUnits(balanceUS, 6); // format usdc bal from wei to decimal
      setBalance(ethers.utils.formatUnits(bal, 6));
      // console.log({
      //   name,
      //   sym,
      //   bal
      // });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUsdc = async () => {
    const usdcContract = await getContract();

    try {
      const txn = await usdcContract.gimmeSome({ gasPrice: 52399666204 });
      setLoading(true);

      if (txn) {
        setLoading(false);
      }
      // const hash = txn.hash;
      setHash(txn.hash);
      console.log(hash);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="container">
      <div className="header">
        <h2>Smart Contract Dapp</h2>
        {hasMetamask && <button onClick={connectWallet}>Connect Wallet</button>}
      </div>
      <div className="wallet-details">
        <p>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
        <p>{balance} FakeUSDC </p>
      </div>
      <p>{message}</p>
      <div className="card">
        <button onClick={getUsdc}> Mint USDC token </button>
        {hash && (
          <p>
            Successfull view the transaction here:{" "}
            {`https://ropsten.etherscan.io/tx/${hash}`}
          </p>
        )}
        {/* <button onClick={getUsdcDetails}>Get Fake USDC details</button> */}

        {/* Transfer */}
        <hr />
        <p>Send USDC to another wallet</p>
        <input
          type="text"
          placeholder="Enter wallet address"
          onChange={handleChange}
          value={values.address}
          name="address"
        />
        <input
          type="number"
          placeholder="Enter amount of USDC"
          onChange={handleChange}
          value={values.amount}
          name="amount"
        />
        <button onClick={transferToken}>Transfer</button>
      </div>
      {/* Debug stuff */}
      {/* <script src="//cdn.jsdelivr.net/npm/eruda"></script>
      <script>eruda.init();</script> */}
    </div>
  );
}
