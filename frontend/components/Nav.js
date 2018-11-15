import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

const Nav = () => (
  <User>
    {/* 2 level destructuring, getting the data prop from payload and then the me prop from data */}
    {({data: {me}}) => (
      <NavStyles>
        {/* Transform to link which routes without refreshing the page */}
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          // can use empty angle brackets to wrap multiple elements with one parent element (known as fragments)
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Accounts</a>
            </Link>
            <Signout />
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
)

export default Nav;