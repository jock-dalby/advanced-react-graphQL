import Link from 'next/link';

const Home = props => {
  return (
    <div>
      <p>Home</p>
      {/* Transform to link which routes without refreshing the page */}
      <Link href="/sell">
        <a>Sell</a>
      </Link>
    </div>
  )
};

export default Home; 