import { Component } from 'react';
import Header from './Header';
import Meta from './Meta';
import styled from 'styled-components';

const MyButton = styled.button`
  background: ${({color}) => color};
  font-size: ${({huge}) => (huge ? '100px' : '50px')};
  /* font-size: 50px; */

  span {
    font-size: 100px;
  }
`;

class Page extends Component {
  render() {
    return (
      <div>
        <Meta />
        <Header />
        <MyButton huge color="green">
          Click me
          <span>💪</span>
        </MyButton>
        {this.props.children}
      </div>
    );
  }
}

export default Page;
