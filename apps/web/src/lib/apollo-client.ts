import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';

// Use relative URL for same-origin requests (works in both dev and production)
const getGraphQLUrl = () => {
  // On the server side, we need to use the full URL
  if (typeof window === 'undefined') {
    // In production (Vercel), use VERCEL_URL
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api/graphql`;
    }
    // In development, use localhost
    return (
      process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
      'http://localhost:3000/api/graphql'
    );
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
