import { Component } from 'react'
import { StockMarketServiceContext } from '../../services/StockMarketService';

class StockInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.stockMarketService.getStockInfo(this.props.match.params.symbol)
      .then(response => {
        console.log(response);
        this.setState({...response});
      });
  }
  
  render() {
    let view;
    if (Object.keys(this.state).length !== 0) {
      let priceChangeIcon, priceChangeText;
      let priceChange = (this.state.latestPrice - this.state.previousClose).toFixed(2);
      let priceChangePercent = (priceChange / this.state.previousClose).toFixed(2);
      if (priceChange > 0) {
        priceChangeIcon = (
          <span className="icon">
            <i className="fas fa-caret-up"></i>
          </span>
        );
        priceChangeText = <div className="subtitle is-size-5 has-text-success"> {priceChangeIcon} {priceChange} ({priceChangePercent})% </div>
      } else if (priceChange < 0){
        priceChangeIcon = (
          <span className="icon">
            <i className="fas fa-caret-down"></i>
          </span>
        );
        priceChangeText = <div className="subtitle is-size-5 has-text-danger"> {priceChangeIcon} {priceChange} ({priceChangePercent})% </div>
      } else {
        priceChangeText = <div className="subtitle is-size-5"> {priceChangeIcon} {priceChange} ({priceChangePercent})% </div>
      }

      view = (
        <div>
          <h1 className="title is-size-2">{this.props.match.params.symbol} | {this.state.companyName}</h1>
          <h2 className="subtitle is-size-4">
            {this.state.latestPrice}
            {priceChangeText}
          </h2>

          This is the stock info page for <h1>{this.props.match.params.symbol}</h1>
        </div>
      );
    } else {
      view = null;
    }

    return view;
  }
}

const StockInfoComponent = (props) => (
  <StockMarketServiceContext.Consumer>
    {
      (stockMarketService) => 
        <StockInfo {...props} stockMarketService={stockMarketService}/>
    }
  </StockMarketServiceContext.Consumer>
);

export default StockInfoComponent;
