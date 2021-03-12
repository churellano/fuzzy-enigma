import { Component } from 'react'
import { debounce } from 'lodash';
import { getData } from '../../helpers/http';
import { IEX_API } from '../../constants';
import { IEX_API_KEY_PROD, IEX_API_KEY_SANDBOX } from '../../api-keys';
import './StockSearchComponent.css';

import { StockMarketServiceContext } from '../../services/StockMarketService';

class StockSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
    };

    this.search = debounce(this.search.bind(this), 300);
  }

  search(event) {
    let searchTerm = String(event.target.value).trim().toLowerCase()

    if (searchTerm) {
      this.props.stockMarketService.searchStocks(searchTerm)
        .then(response => {
          this.setState({ searchResults: response });
        });
    } else {
      this.setState({ searchResults: [] });
    }

  }

  render() {
    return (
      <div className='stock-search'>
        <input className="input is-rounded" type="text" placeholder="Search stocks or companies" onChange={this.search}></input>
          <div className="dropdown-content is-active">
            { this.state.searchResults.map(result => <a className="dropdown-item" href={'/stock/' + result.symbol} key={result.symbol}> {result.symbol} </a>) }
          </div>
      </div>
    );
  }
}

const StockSearchComponent = (props) => (
  <StockMarketServiceContext.Consumer>
    {
      (stockMarketService) => 
        <StockSearch {...props} stockMarketService={stockMarketService}/>
    }
  </StockMarketServiceContext.Consumer>
);

export default StockSearchComponent;
