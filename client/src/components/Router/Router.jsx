import { Component } from 'react'

import { BrowserRouter, Route, Switch } from "react-router-dom";
// import Login from '../Login/Login';
import Overview from '../Overview/Overview';
import StockInfo from '../StockInfo/StockInfoComponent';
import { StockMarketServiceProvider } from '../../services/StockMarketService';

export default class Router extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/stock/:symbol' 
                 component={(props) => 
                  <StockMarketServiceProvider>
                    <StockInfo {...props} />
                  </StockMarketServiceProvider>} />
          {/* <Route path='/login' component={Login} /> */}
          <Route path='/' component={Overview} />
        </Switch>
      </BrowserRouter>
    );
  }
}
