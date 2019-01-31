import Link from 'next/link';

const Nav = () => (
  <div>
    <Link href="/index">
      <a>Home!</a>
    </Link>
    <Link href="/sell">
      <a>Sell!</a>
    </Link>
  </div>
);

export default Nav;
