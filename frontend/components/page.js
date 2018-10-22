import styled, { ThemeProvider, injectGlobal } from 'styled-components';
import React, { Component } from 'react';

import Header from './Header';
import Meta from '../components/Meta';

// ThemeProvider uses React context api which allows you to specify values up high (e.g. theme)
// and any deeply nested children can access those values without having to pass down the values
// from component to component.

const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
}

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

// Define global styles
injectGlobal`
  /* Define font */
  @font-face {
    font-family: 'radnika_next';
    src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  html {
    /*
    * Best wat to set border box is set it explicitly on html
    * and then inherit on everything else as below.box-sizing
    *
    * Set base font size to 10px and then work in rem for all other
    * styles and easy to do math. 16px is 1.6rem etc.
    */
    box-sizing: border-box;
    font-size: 10px;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    /* Assign font */
    font-family: 'radnika_next'
  }

  a {
    text-decoration: none;
    /* Dont have access to props because defining global styles and not inside of ThemeProvider
    * but because in same file we can access using theme.black. If wasn;t in same file we would
    * need to import theme and access it directly
    * color: ${props => props.theme.black}
    */
    color: ${theme.black}
  }
`;

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Meta />
          <Header />
          <Inner>{this.props.children}</Inner>
        </StyledPage>
      </ThemeProvider>
    )
  }
}

export default Page;