/**
 Apollo Boost is an official package put out by Apollo.
 Apollo Boost includes some packages that we think are essential to developing with Apollo Client. Here's what's in the box:

  - apollo-client: Where all the magic happens
  - apollo-cache-inmemory: Our recommended cache
  - apollo-link-http: An Apollo Link for remote data fetching
  - apollo-link-error: An Apollo Link for error handling
  - apollo-link-state: An Apollo Link for local state management
  - graphql-tag: Exports the gql function for your queries & mutations
 */
import ApolloClient from 'apollo-boost';
/**
  next-with-apollo gives us a hoc that will expose the apollo client (client-side db) via a prop.
  react-apollo comes with some tools for doing this but because we are using next.js and want
  server-side rendering to work we have to use next-with-apollo and do a little extra work.
*/
import withApollo from 'next-with-apollo';
import { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION }  from '../components/Cart';

import { endpoint } from '../config';

// pass in auth headers
function createClient({ headers }) {
  // return a new client with the url of our endpoint
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    // on each request, include login cookies from browser
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    // local data
    clientState: {
      resolvers: {
        Mutation: {
          // Wes ain't sure what first arg is but we don't need it
          toggleCart(_, variables, client) {
            // read the cartOpen value from cache
            const { cartOpen } = client.cache.readQuery({
              query: LOCAL_STATE_QUERY
            });
            // write the cart state to the opposite
            const data = {
              data: {
                cartOpen: !cartOpen
              }
            }
            client.cache.writeData(data);
            // TODO In tutorial, we are returning data but don't know why, check if need and remove if not
            // return data;
          }
        }
      },
      defaults: {
        cartOpen: true
      }
    }
  });
}

export default withApollo(createClient);
