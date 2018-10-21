import React from 'react'
import App, { Container } from 'next/app';

import Page from '../components/page';

// Have to use namespace _app.js and component name MyApp
// to override Next.js default App wrapper component
// See https://github.com/zeit/next.js/

class MyApp extends App {
  render() {
    // destructure component value from this.props
    const { Component } = this.props;

    return (
      <Container>
        <Page>
          <Component />
        </Page>
      </Container>
    )
  }
}

export default MyApp;