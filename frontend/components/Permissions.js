import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION ($permissions: [Permission], $userId: ID!) {
    updatePermissions (permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`

const Permissions = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <ErrorMessage error={error} />
      return (
        <div>
          <div>
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                  <th>👇🏻</th>
                </tr>
              </thead>
              <tbody>{data.users.map(user => <UserPermissions key={user.id} user={user} />)}</tbody>
            </Table>
          </div>
        </div>
      )
    }}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired,
  };

  state = {
    // populating intial state using props is a no-no in React because if they change
    // at a higher level after component has been created, the state will not be updated.
    // In this situation it is fine because we are seeding the data and then updating
    // when user presses update.
    permissions: this.props.user.permissions,
  }

  handlePermissionChange = e => {
    const checkbox = e.target;
    // take a copy of current permissions
    let updatedPermissions = [...this.state.permissions];

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value)
    }
    console.log(updatedPermissions)
    this.setState({
      permissions: updatedPermissions
    })
  }

  render() {
    const user = this.props.user;
    return (
      <Mutation mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id
        }}
        >
        {(updatePermissions, { loading, error }) => {
          return (
            <>
              {error && <tr><td colspan="8"><ErrorMessage error={error} /></td></tr>} 
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map(permission => (
                  <td key={permission}>
                    <label htmlFor={`${user.id}-permission-${permission}`}>
                      <input type="checkbox"
                        id={`${user.id}-permission-${permission}`}
                        checked={this.state.permissions.includes(permission)}
                        value={permission}
                        onChange={this.handlePermissionChange}
                        // if want to call the mutation from inside the event handler e.g. to update on
                        // the server each time a checkbox is checked, pass in the mutation as below
                        // and call updatePermissions as a callback function after calling setState.
                        // onChange={e => this.handlePermissionChange(e, updatePermissions)}
                        />
                    </label>
                  </td>
                ))}
                <td>
                  <SickButton type="button"
                    disabled={loading}
                    onClick={updatePermissions}>
                      Updat{loading ? 'ing' : 'e'}
                  </SickButton>
                </td>
              </tr>
            </>
          )
        }}
      </Mutation>
    );
  }
}

export default Permissions;