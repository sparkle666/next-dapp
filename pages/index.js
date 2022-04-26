import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Notifications from "./Notifications";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  let blockNum;
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

  const connect = async () => {
    // connect to Metamask

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    let userAddress = await signer.getAddress();
    //console.log(userAddress)
    setAddress(userAddress);
    // Get current block number
    // blockNum = await provider.getBlockNumber();
  };
  const getUsdc = async () => {
    const usdcContract = await new ethers.Contract(
      usdc.address,
      usdc.abi,
      signer
    );
    const name = await usdcContract.name();
    const sym = await usdcContract.symbol();
    const bal = await provider.getBalance(
      "0x1D3E0725bD6dAf542C780AeDF28553B399556697"
    );
    const balEth = ethers.utils.formatEther(bal);
    try {
      const txn = await usdcContract.gimmeSome({ gasPrice: 52399666204 });
      const hash = txn.hash;
      console.log({
        usdcContract,
        sym,
        name,
        balEth,
        hash,
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={styles.container}>
      <button onClick={connect}> Connect </button>
      <p> Your address -{address}</p> <br />
      <p>Blocknum {blockNum} </p>
      <button onClick={getUsdc}> Get Usdc token </button>
      <script src="//cdn.jsdelivr.net/npm/eruda"></script>
      <script>eruda.init();</script>
    </div>
  );
}
