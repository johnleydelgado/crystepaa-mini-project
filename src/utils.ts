import { ethers } from 'ethers';
import protocolDataProviderAbi from './abi/AaveProtocolDataProvider.json';
import { AavePositions } from './types';

// Aave V2 on Ethereum mainnet
const AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS = '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d';

// Replace with your Infura Project ID or environment variable
const INFURA_URL = 'https://mainnet.infura.io/v3/b6149aacc8cf48d7a20e83e46ac3f786';

/**
 * Fetch all Aave V2 positions for a given wallet
 * from the on-chain Protocol Data Provider.
 *
 * @param userAddress - Ethereum address of the user
 * @returns AavePositions with collateral_positions and borrowing_positions
 */
export async function getAavePositions(userAddress: string): Promise<AavePositions> {
  try {
    // In ethers v6, instantiate a JsonRpcProvider like this:
    const provider = new ethers.JsonRpcProvider(INFURA_URL);

    // Create a contract instance with the correct ABI and address
    const dataProviderContract = new ethers.Contract(
      AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS,
      protocolDataProviderAbi,
      provider
    );

    // `getAllReservesTokens()` returns an array of [symbol, tokenAddress]
    const allReserves: Array<[string, string]> =
      await dataProviderContract.getAllReservesTokens();

    const collateralPositions = [];
    const borrowingPositions = [];

    for (const reserve of allReserves) {
      // `getUserReserveData(reserveAddress, userAddress)` returns an array of BigInts and booleans
      // [ currentATokenBalance,
      //   currentStableDebt,
      //   currentVariableDebt,
      //   principalStableDebt,
      //   scaledVariableDebt,
      //   liquidityRate,
      //   variableBorrowRate,
      //   stableBorrowRate,
      //   liquidityIndex,
      //   variableBorrowIndex,
      //   lastUpdateTimestamp,
      //   usageAsCollateralEnabled
      // ]
      const [symbol, reserveAddress] = reserve;

      const [
        currentATokenBalance,
        currentStableDebt,
        currentVariableDebt,
        principalStableDebt,
        scaledVariableDebt,
        liquidityRate,
        variableBorrowRate,
        stableBorrowRate,
        liquidityIndex,
        variableBorrowIndex,
        lastUpdateTimestamp,
        usageAsCollateralEnabled,
      ] = await dataProviderContract.getUserReserveData(reserveAddress, userAddress);


      const hasCollateral = currentATokenBalance !== 0n;
      const totalDebt = currentStableDebt + currentVariableDebt;
      const hasDebt = totalDebt !== 0n;
      // Skip if user has neither collateral nor debt in this reserve
      if (!hasCollateral && !hasDebt) {
        continue;
      }

      const position = {
        symbol,
        reserveAddress,
        underlyingBalance: String(currentATokenBalance),
        underlyingBalanceETH: '0', // Optionally 
        underlyingBalanceUSD: '0', // Optionally 
        borrowBalance: String(totalDebt),
        borrowBalanceETH: '0',
        borrowBalanceUSD: '0',
        usageAsCollateralEnabled: Boolean(usageAsCollateralEnabled),
      };


      if (hasCollateral) {
        collateralPositions.push(position);
      }
      if (hasDebt) {
        borrowingPositions.push(position);
      }
    }
    
    return {
      collateral_positions: collateralPositions,
      borrowing_positions: borrowingPositions,
    };
    
  } catch (error) {
    console.error('Failed to fetch Aave V2 positions:', error);
    // Return empty arrays if an error occurs
    return {
      collateral_positions: [],
      borrowing_positions: [],
    };
  }
}
