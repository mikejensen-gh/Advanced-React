import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Head from 'next/head';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

const SingleItemStyles = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .details {
    margin: 2rem;
    font-size: 2rem;
  }
`;

class SingleItem extends Component {
  render() {
    const { id } = this.props;

    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id,
        }}
      >
        {({ error, loading, data: { item } }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          if (!item) return <p>No item found for {id}</p>;

          return (
            <SingleItemStyles>
              <Head>
                <title>Sick fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          );
        }}
      </Query>
    );
  }
}

SingleItem.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SingleItem;
export { SINGLE_ITEM_QUERY };
