import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  update = (cache, payload) => {
    // manually update apollo cache on client to match server
    // 1. read cache with graphql for items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });

    // 2. filter deleted item out of the page
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );

    // 3. Put items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    const { children, id } = this.props;
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{
          id,
        }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (window.confirm('Delete?')) {
                deleteItem().catch(error => {
                  alert(error.message);
                });
              }
            }}
            type="button"
          >
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}

DeleteItem.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
};

export default DeleteItem;
export { DELETE_ITEM_MUTATION };
