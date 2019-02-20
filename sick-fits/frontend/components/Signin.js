import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class Signin extends Component {
  state = {
    name: '',
    email: '',
    password: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { name, email, password } = this.state;

    return (
      <Mutation mutation={SIGNIN_MUTATION} variables={this.state}>
        {(signin, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              const res = await signin();
              console.log(res);

              this.setState({ name: '', email: '', password: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign into your account</h2>

              <Error error={error} />

              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placedholder="email"
                  value={email}
                  onChange={this.saveToState}
                />
              </label>

              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placedholder="password"
                  value={password}
                  onChange={this.saveToState}
                />
              </label>

              <button type="submit">Sign in</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signin;
