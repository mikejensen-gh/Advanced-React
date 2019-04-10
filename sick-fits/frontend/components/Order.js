import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyle from './styles/OrderStyles';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      total
      charge
      createdAt
      user {
        id
        email
        name
      }
      items {
        id
        title
        description
        image
        price
        quantity
      }
    }
  }
`;

const Order = props => (
  <Query query={SINGLE_ORDER_QUERY} variables={{ id: props.id }}>
    {({ error, loading, data }) => {
      if (error) {
        return <Error error={error} />;
      }

      if (loading) {
        return <p>Loading...</p>;
      }

      const { order } = data;

      return (
        <OrderStyles>
          <Head>
            <title>Sick Fits - Order {order.id}</title>
          </Head>
          <p>
            <span>Order ID:</span>
            <span>{order.id}</span>
          </p>
          <p>
            <span>Charge</span>
            <span>{order.charge}</span>
          </p>
          <p>
            <span>Date</span>
            <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
          </p>
          <p>
            <span>Order total</span>
            <span>{formatMoney(order.total)}</span>
          </p>
          <p>
            <span>Item count</span>
            <span>{order.items.length}</span>
          </p>
          <div className="items">
            {order.items.map(item => (
              <div className="order-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h2>{item.title}</h2>
                  <p>Qty: {item.quantity}</p>
                  <p>Each: {formatMoney(item.price)}</p>
                  <p>
                    Subtotal: {item.quantity} x {formatMoney(item.price)} ={' '}
                    {formatMoney(item.price * item.quantity)}
                  </p>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </OrderStyles>
      );
    }}
  </Query>
);

Order.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Order;
