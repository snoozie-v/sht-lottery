import { useContext, useState, useEffect } from 'react';
import { VeChainContext } from '../context/VeChainContext';
import { approveToken, enterLottery, getWinProbability, getTokenAllowance } from '../services/lotteryService';
import lotteryABI from '../components/lotteryABI';

const EnterLotteryForm = ({ lotteryAddress, tokenAddress, onEnterSuccess }) => {
  const { thorClient, provider, connectedAccount } = useContext(VeChainContext);
  const [output, setOutput] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [winProbability, setWinProbability] = useState(null);
  const [allowance, setAllowance] = useState(null);
  const [isAllowanceLoading, setIsAllowanceLoading] = useState(false);

  const APPROVAL_AMOUNT = 100_000_000_000_000_000_000_000n; // 100,000 tokens with 18 decimals
  const ENTRY_AMOUNT = 10_000_000_000_000_000_000_000n; // 10,000 tokens with 18 decimals

  // Fetch win probability and allowance when component mounts or dependencies change
  useEffect(() => {
    const fetchData = async () => {
      if (!thorClient || !connectedAccount || !lotteryAddress || !tokenAddress) return;

      setIsAllowanceLoading(true);
      try {
        // Fetch win probability
        const probability = await getWinProbability(thorClient, lotteryAddress, lotteryABI, connectedAccount);
        setWinProbability(probability);

        // Fetch token allowance
        const allowance = await getTokenAllowance(thorClient, tokenAddress, connectedAccount, lotteryAddress);
        setAllowance(BigInt(allowance));
      } catch (err) {
        console.error('Failed to fetch data:', err.message);
        if (err.message.includes('No players in the lottery')) {
          setOutput('No players in the lottery yet');
          setWinProbability(null);
        } else {
          setOutput(`Error fetching data: ${err.message}`);
          setWinProbability(null);
        }
        setAllowance(null);
      } finally {
        setIsAllowanceLoading(false);
      }
    };

    fetchData();
  }, [thorClient, connectedAccount, lotteryAddress, tokenAddress]);

  const handleCheckAllowance = async () => {
    if (!thorClient || !connectedAccount || !lotteryAddress || !tokenAddress) {
      setOutput('Please connect a wallet');
      return;
    }
    setIsCheckingAllowance(true);
    try {
      const allowance = await getTokenAllowance(thorClient, tokenAddress, connectedAccount, lotteryAddress);
      setAllowance(BigInt(allowance));
      setOutput(`Allowance checked: ${(Number(allowance) / 10 ** 18).toFixed(2)} SHT approved`);
    } catch (err) {
      setOutput(`Error checking allowance: ${err.message}`);
    } finally {
      setIsCheckingAllowance(false);
    }
  };

  const handleApprove = async () => {
    if (!thorClient || !provider || !connectedAccount) {
      setOutput('Please connect a wallet');
      return;
    }
    setIsApproving(true);
    try {
      const txID = await approveToken(
        thorClient,
        provider,
        connectedAccount,
        tokenAddress,
        lotteryAddress,
        APPROVAL_AMOUNT
      );
      setOutput(`Approval successful: ${txID}`);
      // Refresh allowance
      const newAllowance = await getTokenAllowance(thorClient, tokenAddress, connectedAccount, lotteryAddress);
      setAllowance(BigInt(newAllowance));
    } catch (err) {
      setOutput(`Approval error: ${err.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleEnter = async () => {
    if (!thorClient || !provider || !connectedAccount) {
      setOutput('Please connect a wallet');
      return;
    }
    setIsEntering(true);
    try {
      const txID = await enterLottery(thorClient, provider, connectedAccount, lotteryAddress, lotteryABI);
      setOutput(`Entered lottery: ${txID}`);
      onEnterSuccess();

      // Refresh win probability and allowance
      const probability = await getWinProbability(thorClient, lotteryAddress, lotteryABI, connectedAccount);
      setWinProbability(probability);
      const newAllowance = await getTokenAllowance(thorClient, tokenAddress, connectedAccount, lotteryAddress);
      setAllowance(BigInt(newAllowance));
    } catch (err) {
      setOutput(`Enter error: ${err.message}`);
    } finally {
      setIsEntering(false);
    }
  };

  // Format allowance for display
  const formattedAllowance = allowance !== null ? (Number(allowance) / 10 ** 18).toFixed(2) : '0.00';

  // Determine if approval is needed
  const needsApproval = allowance === null || allowance < ENTRY_AMOUNT;

  return (
    <div>
      <h2>Enter Lottery</h2>

      {!connectedAccount && <p>Please connect a wallet to participate.</p>}

      <div>
        <button
          onClick={handleCheckAllowance}
          disabled={!thorClient || !connectedAccount || isCheckingAllowance || isApproving || isEntering}
        >
          {isCheckingAllowance ? 'Checking...' : 'Check Allowance'}
        </button>
      </div>
      {isAllowanceLoading ? (
        <p>Loading allowance...</p>
      ) : (
        allowance !== null && <p>Approved tokens: {formattedAllowance} SHT</p>
      )}

      {needsApproval ? (
        <button
          onClick={handleApprove}
          disabled={!thorClient || !connectedAccount || isApproving || isEntering || isCheckingAllowance}
        >
          {isApproving ? 'Approving...' : `Approve ${APPROVAL_AMOUNT / 10n ** 18n} SHT`}
        </button>
      ) : (
        <button
          onClick={handleEnter}
          disabled={!thorClient || !connectedAccount || isApproving || isEntering || isCheckingAllowance}
        >
          {isEntering ? 'Entering...' : 'Enter Lottery (10,000 SHT)'}
        </button>
      )}

      {winProbability !== null && (
        <p>Your win probability: {winProbability}%</p>
      )}
      {output && <p>{output}</p>}
    </div>
  );
};

export default EnterLotteryForm;
