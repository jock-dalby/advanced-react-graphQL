import React from 'react'
import App, { Container } from 'next/app';
import Page from '../components/Page';

import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

// Have to use namespace _app.js and component name MyApp
// to override Next.js default App wrapper component
// See https://github.com/zeit/next.js/

class MyApp extends App {
  /**
    When we go to different pages on our app we need to surface the page values.
    getInitialProps is a special next.js lifecycle method that runs before render
    is ever called. Required for server-side rendered apps.
   */
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    // If any of the components we are rendering has props, 
    if (Component.getInitialProps) {
      // it will crawl those pages for queries or mutations the component has to fetch
      // and wait for them to be resolved before it renders the page. This is awesome
      // becuase no longer have to use isLoading, hasErrored etc.
      pageProps = await Component.getInitialProps(ctx);
    }
    // This exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  // static async getInitialProps({ Component, ctx }) {
  //   let pageProps = {};
  //   if (Component.getInitialProps) {
  //     pageProps = await Component.getInitialProps(ctx);
  //   }
  //   // this exposes the query to the user
  //   pageProps.query = ctx.query;
  //   return { pageProps };
  // }

  render() {
    // destructure component value from this.props
    const { Component, apollo, pageProps } = this.props;


    /**
      To expose Apollo client to app we wrap the app in an ApolloProvider and
      pass in our instance of the Apollo client via the client attr. Apollo client
      is avialble through props because our app is wrapped in out withData hoc.
     */
    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps}/>
          </Page>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withData(MyApp);
