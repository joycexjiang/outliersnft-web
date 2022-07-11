/*custom script that handles these three steps
1) compile Contract
2) deploy to local blockchain
3) once it's there, that console.log will run
*/

const main = async () => {
    /*compiles contract and generates necessary files to work w contract under artificats */
    const nftContractFactory = await hre.ethers.getContractFactory('OutliersNFT'); 
    /* hardhat -> creates a local ethereum network just for this contract. after script completes, it'll destroy that local network. fresh blockchain everytime contract is run*/
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
  
     // Call the function.
    let txn = await nftContract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn.wait()

    // Mint another NFT for fun.
    txn = await nftContract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn.wait()

};
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();