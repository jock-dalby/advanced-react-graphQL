import Link from 'next/link';

const Nav = () => (
  <div>
    {/* Transform to link which routes without refreshing the page */}
    <Link href="/sell">
      <a>Sell</a>
    </Link>
    <Link href="/">
      <a>Home</a>
    </Link>
  </div>
)

export default Nav;