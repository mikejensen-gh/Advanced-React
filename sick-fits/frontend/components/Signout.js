import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';
import SickButton from './styles/SickButton';

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = props => (
  <Mutation
    mutation={SIGNOUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {signout => (
      <button
        onClick={async e => {
          e.preventDefault();
          const res = await signout();
          console.log(res);
        }}
        type="button"
      >
        Sign out
      </button>
    )}
  </Mutation>
);

export default Signout;
