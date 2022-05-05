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
  const [balance, setBalance] = useState(0);
  const [estimatedGasPrice, setEstimatedGasPrice] = useState();

  useEffect(() => {
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
    console.log(e.target);
    setValues({ ...values, [name]: value });
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
      const amount = ethers.utils.parseUnits("10", 6);

      const usdcContract = await getContract();
      const txn = await usdcContract.transfer(
        "0xccA6BBb221c3195BdB56F07f720752db000B1E3A",
        amount,
        { gasPrice: 52399666204 }
      );
      console.log(txn.hash);
    } catch (e) {
      console.log(e);
    }
  };
  const displayContract = async () => {
    const contract = await getContract();
    const sym = await contract.name();
    console.log({ contract, sym });
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

    // Get current block number
    // blockNum = await provider.getBlockNumber();
  };
  const getUsdcDetails = async () => {
    try {
      const usdcContract = await getContract();
      const name = await usdcContract.name; // Get name
      const sym = await usdcContract.symbol; // get symbol

      const balanceUS = await usdcContract.balanceOf(address); //call the usdc contract to get current usdv balance in acc
      const usdcBal = ethers.utils.formatUnits(balanceUS, 6); // format usdc bal from wei to decimal
      setBalance(usdcBal);
      console.log({
        name,
        sym,
        balanceUs,
        usdcBal,
      });
    } catch (error) {
      console.log(error);
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
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
      <div className="wallet-details">
        <p>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
        <p>{balance.toFixed(2)} FakeUSDC </p>
      </div>
      <div className="card">
        <button onClick={getUsdc}> Mint USDC token </button>
        {hash && (
          <p>
            Successfull view the transaction here:{" "}
            {`https://ropsten.etherscan.io/tx/${hash}`}
          </p>
        )}
        <button onClick={displayContract}>Get Fake USDC details</button>

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
      <script src="//cdn.jsdelivr.net/npm/eruda"></script>
      <script>eruda.init();</script>
    </div>
  );
}
