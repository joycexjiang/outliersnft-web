import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import gallery from './assets/gallery.gif';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import outliersNFT from './utils/OutliersNFT.json';
import outliersLogo from './assets/LOGO.png';
import './styles/fonts/TupacMagrath.woff';

// Constants
const TWITTER_HANDLE = 'joycebydsgn';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /* state variable we use to store our user's public wallet after importing useState*/
  const [currentAccount, setCurrentAccount] = useState("");
  const [statusUpdate, setstatusUpdate]= useState("");

  /*making sure this is async*/

  const checkIfWalletIsConnected = async () => {
    /*making sure we have access to window.ethereum */
    const {ethereum}=window;
  
    if (!ethereum) {
      console.log("Make sure you have metamask!!");
      return;
    } else{
      console.log("We have the ethereum object", ethereum);
    }

      /*
      * Check if we're authorized to access the user's wallet
      */
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    /*
      * User can have multiple authorized accounts, we grab the first one if its there!
      */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setstatusUpdate("Found an authorized account, go ahead and mint!");
      setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
        setstatusUpdate("No authorized account found");
      }
    }
  

  /*implementing connectWallet method */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if(!ethereum){
        setstatusUpdate("get MetaMask pls");
        return;
      }else{
        setstatusUpdate("found MetaMask wallet. connecting ..");
      }

      /*method to request access to account */
      const accounts = await ethereum.request({method:"eth_requestAccounts"});

      /*prints out public address once we authorize metamask */
      setstatusUpdate("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error){
        setstatusUpdate("There was an error.")
        // setstatusUpdate(error.toString())
        console.log(error())
    }
  }

  //call make nft function from our web app
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xBb514353b0665BC096399c2D9133c8bEdC6a7d7a";
  
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        // ethers is a lbirary that helps our frontend talk to our contract
        //A "Provider" is what we use to actually talk to Ethereum nodes. 
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, outliersNFT.abi, signer);
        // this line creates the connection to our contract
        //contract's address -> abi file
        
        setstatusUpdate("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.mint();

        // ask connected contract the same in etherscan, query has role can do that here, use that to check/disable the button, pop up message
        //disable button -> ethers connection to check whether to render the button
  
        setstatusUpdate("Mining... please wait.")
        await nftTxn.wait();
        
        setstatusUpdate(`You've mined your NFT! see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        {seeTransaction()}

      } else {
        setstatusUpdate("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setstatusUpdate("there was an error.")
      // setstatusUpdate(error.toString())
      console.log(error())
    }
  }

  /*runsfunction when the page loads */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

    // Render Methods


   //connect wallet button 
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      connect wallet
    </button>
  );

    // mint button
  const connectedMint = () => (
    <button onClick={askContractToMintNft} className="cta-button mint-button">
      mint nft
    </button>
  );

  const seeTransaction = () =>(
    <p className ="sub-text">
      mined! 
    </p>
  )

  
  return (
    
    <div className="App">
      <div className="container">

        <div className="glass-container">

          <div className="column1">
            
            <img alt="NFT Preview" className="card" src={gallery} /><p/>


      &#9758; <span id="news">updating status ..</span><br/>

      <text className="statusUpdateText">
            {statusUpdate}
          </text>


        </div>

          <span className="column2">
            
            <p className="header">ThunderLizard <p style={{fontSize:'3.5vw', lineHeight:'0vh'}}>NFT Collection</p></p>
              
              <text className="sub-text">
                <p><b>We connect, educate, and empower the top Web3 builders in the world.</b> </p>
                Outliers is a 10-week, summer program to empower exceptional student builders in Crypto and Web3.
                Through curriculum and technical projects, Outliers equips students from across the country with the resources, knowledge, and community necessary 
                to build and scale a successful Web3 venture. 
              </text> <br/>

              {currentAccount === "" ? (renderNotConnectedContainer()) : (
                <button onClick={askContractToMintNft} className="cta-button mint-button">
                mint nft
                </button>

              )}
              <br/><br/>
              <text><small>⚠️ The Thunderlizard NFT is reserved for Outliers only. ⚠️ </small></text>
          </span>

        
        </div>

        <a
          className="outliers-logo"
          href="http://outliers.build"
          target="_blank"
          rel="noreferrer" 
          >
            <img alt="Outliers Logo" className="outliers-logo" src={outliersLogo} />
          </a>

          <i>building the future of web3 and deFi</i>

        <div className="footer-container">
        
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
         >{`built by @${TWITTER_HANDLE}`}</a></div>

         
        </div>


        
      </div>
  );
};

export default App;
