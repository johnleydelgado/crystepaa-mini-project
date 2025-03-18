import express from 'express';
import { schema, rootValue } from './schema';
import { parse, validate, execute, specifiedRules, DocumentNode } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';

const app = express();

// create a custom handler so we can pass "rootValue"
const handler = createHandler({
  schema,
  // The parse, validate, and execute come from graphql@16
  parse,
  validate: (schema, documentAST, rules) => validate(schema, documentAST, rules ?? specifiedRules),
  execute: async (args) => {
    // Here we attach rootValue so that our resolvers can access it
    return execute({
      ...args,
      rootValue,
    });
  },
});

// Accept all methods on /graphql
app.all('/graphql', handler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL-HTTP server running at http://localhost:${PORT}/graphql`);
});
