import { buildSchema } from 'graphql';
import { getAavePositions } from './utils';
import { AavePositions } from './types';

// 1. Define the schema in SDL (Schema Definition Language).
export const schema = buildSchema(`
  type Position {
    symbol: String
    reserveAddress: String
    underlyingBalance: String
    underlyingBalanceETH: String
    underlyingBalanceUSD: String
    borrowBalance: String
    borrowBalanceETH: String
    borrowBalanceUSD: String
    usageAsCollateralEnabled: Boolean
  }

  type AavePositions {
    collateral_positions: [Position]
    borrowing_positions: [Position]
  }

  type Query {
    getAavePositions(address: String!): AavePositions
  }
`);

// 2. The arguments type for "getAavePositions"
interface GetAavePositionsArgs {
  address: string;
}

// 3. Our resolvers or "rootValue"
export const rootValue = {
  getAavePositions: async ({ address }: GetAavePositionsArgs): Promise<AavePositions> => {
    return getAavePositions(address);
  },
};
