// import logo from '../../logo.svg';
import './App.css';

import { 
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect 
} from 'react-router-dom';
import Overview from '../Overview/Overview';
import StockInfo from '../StockInfo/StockInfoComponent';
import StockSearch from '../StockSearch/StockSearchComponent';
import { StockMarketServiceProvider } from '../../services/StockMarketService';
import Navbar from '../Navbar/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />

      <Router>
        <Switch>
          <Route path='/stock/:symbol'>
            {
              (props) =>
                <StockMarketServiceProvider>
                  <StockInfo {...props} />
                </StockMarketServiceProvider>
            }
          </Route>
          <Route path='/'>
            <Overview />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
