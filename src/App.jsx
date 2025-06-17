import { useState, useContext, useEffect } from "react";
import { WalletButton, useWallet } from '@vechain/dapp-kit-react'; // Add dapp-kit imports
import EnterLotteryForm from "./components/EnterLotteryForm";
import LotteryStatus from "./components/LotteryStatus";
import AdminControls from "./components/AdminControls";
import './App.css';
import Deployment from "./components/Deployment";
import Testing from "./components/Testing";
import { VeChainContext } from "./context/VeChainContext";

function App() {
  const { walletInfo, connectedAccount, updateProviderWithAccount } = useContext(VeChainContext); // Add connectedAccount and updateProviderWithAccount
  const { account, source } = useWallet(); // Get user wallet info from dapp-kit
  const lotteryAddress = "0x69223c809fd2b166b3e5dee87e8125bc460c7e08";
  const tokenAddress = "0xf7fbcf2ae9f5b3cf4dd72fa6e1ada84499e8c3b2";
  const [statusTrigger, setStatusTrigger] = useState(0);

  const decimals = 18;

  // Update context when user connects/disconnects a wallet
  useEffect(() => {
    updateProviderWithAccount(account);
  }, [account, updateProviderWithAccount]);

  return (
    <div className="lottery-form-container">
      <h1>SHT Lotto</h1>
      <WalletButton /> {/* Add WalletButton for user wallet connection */}
      <div>
        {/* Conditionally display connected wallet or dev wallet */}
        {(connectedAccount || walletInfo?.address) && (
          <p>
            <strong>Wallet Address:</strong>{" "}
            {connectedAccount || walletInfo.address}
            {source && ` (via ${source})`} {/* Show wallet source if connected */}
          </p>
        )}
        {tokenAddress && (
          <p>
            <strong>Token Contract Address:</strong> {tokenAddress}
          </p>
        )}
        {lotteryAddress && (
          <p>
            <strong>Lottery Contract Address:</strong> {lotteryAddress}
          </p>
        )}
        {decimals !== null && (
          <p>
            <strong>Token Decimals:</strong> {decimals}
          </p>
        )}
      </div>

      <EnterLotteryForm
        lotteryAddress={lotteryAddress}
        tokenAddress={tokenAddress}
        onEnterSuccess={() => setStatusTrigger((prev) => prev + 1)}
      />
      {lotteryAddress && (
        <LotteryStatus
          lotteryAddress={lotteryAddress}
          statusTrigger={statusTrigger}
          decimals={decimals}
        />
      )}

      {/* Preserved commented-out sections */}
      {/* <AdminControls lotteryAddress={lotteryAddress} /> */}
      {/* <Testing tokenAddress={tokenAddress}/> */}
      {/* <Deployment tokenAddress={tokenAddress}/> */}
    </div>
  );
}

export default App;
