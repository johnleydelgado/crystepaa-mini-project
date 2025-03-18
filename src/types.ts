export interface Position {
  reserveAddress: string;
  symbol: string
  underlyingBalance: string;
  underlyingBalanceETH: string;
  underlyingBalanceUSD: string;
  borrowBalance: string;
  borrowBalanceETH: string;
  borrowBalanceUSD: string;
  usageAsCollateralEnabled: boolean;
}
  
export interface AavePositions {
  collateral_positions: Position[];
  borrowing_positions: Position[];
}
