import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import Item from './styles/ItemStyles';

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
          <Title>{item.title}</Title>
        </ItemStyles>
      </div>
    );
  }
}

export default item;