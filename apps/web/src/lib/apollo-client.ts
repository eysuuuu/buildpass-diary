import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';

// Use relative URL for same-origin requests (works in both dev and production)
const getGraphQLUrl = () => {
  // On the server side, use localhost to avoid deployment protection
  if (typeof window === 'undefined') {
    // For server-side requests, always use localhost since the API is in the same app
    // This avoids Vercel deployment protection issues
    const port = process.env.PORT || 3000;
    return `http://localhost:${port}/api/graphql`;
  }
  // On the client side, use relative URL (works for same-origin requests)
  return '/api/graphql';
};

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: getGraphQLUrl(),
    }),
  });
});
