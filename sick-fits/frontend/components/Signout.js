import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import SickButton from './styles/SickButton';

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout
  }
`;

class Signout extends Component {
  render() {
    return (
      <Mutation
        mutation={SIGNOUT_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signout, { error, loading }) => (
          <SickButton
            onClick={async e => {
              e.preventDefault();
              const res = await signout();
              console.log(res);
            }}
          >
            Sign out
          </SickButton>
        )}
      </Mutation>
    );
  }
}

export default Signout;
