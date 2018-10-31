import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import Item from './styles/ItemStyles';
import formatMoney from '../lib/formatMoney';

class item extends Component {

  static propTypes = {
    item: PropTypes.object.isRequired,
    // TODO: do typings e.g.
    // item: PropTypes.shape({
    //   title: PropTypes.string.isRequired,
    //   price: PropTypes.number.isRequired,
    // })
  };

  render() {
    const { item } = this.props;
    return (
      <div>
        <ItemStyles>
          {item.image && <img src={item.image} alt={item.title} />}
          <Title>
            <Link href={{
              pathname: 'item',
              query: { id: item.id }
            }}><a>{item.title}</a></Link>
          </Title>
          <PriceTag>{formatMoney(item.price)}</PriceTag>
          <p>{item.description}</p>

          <div className="buttonList">
            <Link href={{
              pathname: 'update',
              query: { id: item.id }
            }}><a>Edit</a></Link>
            <button>Add to cart</button>
            <button>Delete</button>
          </div>
        </ItemStyles>
      </div>
    );
  }
}

export default item;