import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import Error from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const OrderList = () => (
  <Query query={ALL_ORDERS_QUERY}>
    {({ data: { orders }, error, loading }) => {
      if (error) return <Error error={error} />;
      if (loading) return <p>Loading...</p>;

      return (
        <OrderUl>
          {orders.map(order => (
            <OrderItemStyles key={order.id}>
              <Link
                href={{
                  pathname: '/order',
                  query: { id: order.id },
                }}
              >
                <a>
                  <div className="order-meta">
                    <p>
                      {order.items.reduce((a, b) => a + b.quantity, 0)} Items
                    </p>
                    <p>{order.items.length} Products</p>
                    <p>{formatDistance(order.createdAt, new Date())}</p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map(item => (
                      <img key={item.id} src={item.image} alt={item.title} />
                    ))}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          ))}
        </OrderUl>
      );
    }}
  </Query>
);

export default OrderList;
