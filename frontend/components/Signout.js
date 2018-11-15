
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`

const Signout = () => (
  <Mutation mutation={SIGN_OUT_MUTATION}
    // when this mutation has finished, this will update the UI
    // to recognise no user signed in
    refetchQueries = {[
      { query: CURRENT_USER_QUERY }
    ]}
  >
    {signout => <button onClick={signout}>
      Sign out
    </button>}
  </Mutation>
)

export default Signout;