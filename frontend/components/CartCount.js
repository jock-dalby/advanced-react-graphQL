import React from 'react'
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const Dot = styled.div`
  background: ${props => props.theme.red};
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-weight: 400;
  /* below 2 settings mean will give same width for thin numbers (e.g. 1) and fatter numbers (e.g. 8) */
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`;

const AnimationStyles = styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: all 0.4s;
    backface-visibility: hidden;
  }
  /* Initial state of the entered Dot should be half flipped */
  .count-enter {
    transform: scale(4) rotateX(0.5turn);
  }
  /* when transition finished should be flush */
  .count-enter-active {
    transform: rotate(0);
  }
  .count-exit {
    top: 0;
    /* needs to be on top of one another */
    position: absolute;
    /* exiting dot needs to start flush with page */
    transform: rotateX(0);
  }
  .count-exit-active {
    /* exiting dot needs to finsih half flipped */
    transform: scale(4) rotateX(0.5turn);
  }

`

// When count changes, the Dot component will be unmounted and remounted.
// Below we can define how that transition occurs to create an animation
const CartCount = ({ count }) => <AnimationStyles>
  <TransitionGroup>
    <CSSTransition
      unmountOnExit
      className="count"
      classNames="count"
      key={count}
      timeout={{
        // 0.4 secs to mount
        enter: 400,
        // 0.4 secs to unmount
        exit: 400
      }}
      >
      <Dot>{count}</Dot>
    </CSSTransition>
  </TransitionGroup>
</AnimationStyles>;

export default CartCount;