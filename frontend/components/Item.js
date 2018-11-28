import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';

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
          {/* TODO: disable button while routing */}
            <Link href={{
              pathname: 'update',
              query: { id: item.id }
            }}><a>Edit ✏️</a></Link>
            <AddToCart id={item.id}/>
            {/* TODO: Only show 'Delete item' button for items the user owns or has permissions for */}
            <DeleteItem id={item.id}>Delete item</DeleteItem>
          </div>
        </ItemStyles>
      </div>
    );
  }
}

export default item;