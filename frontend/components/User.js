import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
    }
  }
`

const User = props => (
  // Need to get props and manually pass down to children
  <Query query={CURRENT_USER_QUERY} {...props}>
    {payload => props.children(payload)}
  </Query>
)

/**
 * This will allow us to reuse this query and 'query component' as below
 * 
 * <User>
 *  {user => (
 *    <p>user.name</p>
 *  )}
 * </User>
 */

 User.propTypes = {
   // The only thing that must be passed as a child is a function
   children: PropTypes.func.isRequired,
 }

 // Export query component as default export
 export default User;
 // Export query as named export
 export { CURRENT_USER_QUERY };