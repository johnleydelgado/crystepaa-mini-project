# Aave V2 GraphQL Node.js Project

This repository provides a **Node.js** + **Express** + **GraphQL** + **TypeScript** setup for **fetching Aave V2 user positions** (deposits and borrows) via **ethers.js v6** and **Infura** as an RPC provider. It exposes a single `/graphql` endpoint where you can query user collateral/borrowing data.

---

## Features

- **TypeScript** for type-safe development.  
- **Express** as the web server.  
- **GraphQL** endpoint served via [`graphql-http`](https://github.com/graphql/http).  
- **Ethers.js v6** for on-chain data retrieval from Aave Protocol Data Provider.  
- **Nodemon** for live-reloading during development.  

---

## Prerequisites

1. **Node.js** (v14+ recommended).  
2. **npm** or **yarn** installed.  
3. An **Infura Project ID** (sign up at [infura.io](https://infura.io/)) if you want to connect to the Ethereum mainnet.  

---

## Installation & Setup

1. **Clone** or download this repository.  
2. **Install** dependencies:
   ```bash
   npm install
   ```
---

## Project Structure

```
.
├── package.json
├── tsconfig.json
├── nodemon.json             // (optional) if you want to separate nodemon config
└── src
    ├── abi
    │   └── AaveProtocolDataProvider.json    // ABI for the Aave V2 Data Provider
    ├── index.ts                             // Express server & GraphQL-HTTP handler
    ├── schema.ts                            // GraphQL schema & resolvers
    ├── testAave.ts                          // Example test script
    ├── types.ts                             // Type definitions (optional)
    └── utils.ts                             // Utility function to fetch Aave positions
```

---

## Scripts

### 1. Development

```bash
npm run dev
```
- Uses **nodemon** + **ts-node** to auto-reload on changes.
- The server runs on [http://localhost:4000/graphql](http://localhost:4000/graphql) by default.

### 2. Build

```bash
npm run build
```
- Compiles the TypeScript files in `src/` to JavaScript in the `dist/` folder.

### 3. Start (Production)

```bash
npm start
```
- Runs the compiled code from `dist/index.js`.
- Make sure you’ve already run `npm run build`.

### 4. Test Aave (Custom Script)

```bash
npm run test:aave
```
- Executes `ts-node ./src/testAave.ts`.
- This script can be used to quickly test calls to the Aave Data Provider or any other custom logic you have in `testAave.ts`.

---

## Usage

1. **Run** the server (in dev mode): `npm run dev`.
2. **Open** your browser or an API client (e.g., Postman) at:
   ```
   http://localhost:4000/graphql
   ```
3. **Send** a GraphQL query. Example:

   ```graphql
   query {
     getAavePositions(address: "0xYourEthereumAddress") {
       collateral_positions {
         reserveAddress
         underlyingBalance
       }
       borrowing_positions {
         reserveAddress
         borrowBalance
       }
     }
   }
   ```

4. You should get a **JSON** response similar to:

   ```json
   {
     "data": {
       "getAavePositions": {
         "collateral_positions": [
           {
             "reserveAddress": "0x...",
             "underlyingBalance": "123456789"
           }
         ],
         "borrowing_positions": [
           {
             "reserveAddress": "0x...",
             "borrowBalance": "987654321"
           }
         ]
       }
     }
   }
   ```

---

## Key Points

- **AaveProtocolDataProvider.json**: Contains the ABI (Application Binary Interface) for the **Aave V2 Protocol Data Provider** at `0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d`. This is used to query user deposit/borrow info.  
- **Ethers v6**: Returns **BigInt** for numeric types. Our code compares them with standard operators (e.g., `> 0n`) and converts them to strings with `String(...)`.  
- **GraphQL**: We rely on [`graphql-http`](https://github.com/graphql/http) to expose a spec-compliant endpoint. No built-in GraphiQL UI is provided. You can use a separate GUI like [ruru](https://github.com/dolli/ruru) or [Postman](https://www.postman.com/) to test.  

---

## Frequently Asked Questions

1. **How can I see a GraphiQL interface?**  
   - `graphql-http` only handles GraphQL queries. Try installing [ruru](https://github.com/dolli/ruru) and run:
     ```bash
     npx ruru -SP -p 4001 -e http://localhost:4000/graphql
     ```
   - Then open [http://localhost:4001](http://localhost:4001) for a GraphiQL UI.
---
