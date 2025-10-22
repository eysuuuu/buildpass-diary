import { getSchema } from '@/app/api/graphql/schema';
import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';
import { SchemaLink } from '@apollo/client/link/schema';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  // For server-side, use SchemaLink to execute GraphQL directly (no HTTP)
  // This avoids Vercel deployment protection and is faster
  const link =
    typeof window === 'undefined'
      ? new SchemaLink({ schema: getSchema() })
      : new HttpLink({
          uri: '/api/graphql',
          credentials: 'same-origin',
        });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
});
