import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';

const Nav = () => (
  <NavStyles>
    <User>
      {/* 2 level destructuring, getting the data prop from payload and then the me prop from data */}
      {({data: {me}}) => {
        if (me) return <p>{me.name}</p>
        return null
      }}
    </User>
    {/* Transform to link which routes without refreshing the page */}
    <Link href="/items">
      <a>Shop</a>
    </Link>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
    <Link href="/signup">
      <a>Signup</a>
    </Link>
    <Link href="/orders">
      <a>Orders</a>
    </Link>
    <Link href="/me">
      <a>Accounts</a>
    </Link>
  </NavStyles>
)

export default Nav;