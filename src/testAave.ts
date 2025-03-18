// testAave.ts
import { getAavePositions } from './utils'; // Adjust the import path if needed

async function main() {
  try {
    // Provide an Ethereum address that has Aave V2 positions
    // (for example, here's one that might have some data):
    const userAddress = '0x856BC683A7e2fF87192B896c7dA99DdA5ab81E6C'; 

    console.log(`Fetching Aave V2 positions for: ${userAddress} ...`);

    const result = await getAavePositions(userAddress);

    console.log('Collateral Positions:', result.collateral_positions);
    console.log('Borrowing Positions:', result.borrowing_positions);

  } catch (error) {
    console.error('Error in main():', error);
  }
}

main();
