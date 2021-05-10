import { Component } from 'react'
import { StockMarketServiceContext } from '../../services/StockMarketService';

import StockChart from '../StockChart/StockChartComponent';
// import Chart from 'chart.js';
import { CHART_FILL_GREEN, CHART_BORDER_GREEN, CHART_FILL_RED, CHART_BORDER_RED } from '../../constants';
import './StockInfoComponent.css';

// import { historical_1d, historical_5d, historical_1m, historical_6m, historical_1y, historical_5y } from './Prices';

var timeRanges = {
  '1d': '1d',
  '5d': '5dm',
  '1m': '1m',
  '6m': '6m',
  '1y': '1y',
  '5y': '5y',
}

// var historical = historical_5y;

class StockInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      companyName: null,
      historicalPrices: [],
      indexesOfFirstTradingDays: [],
      selectedRange: '1d',
      timeRanges: ['1d', '5d', '1m', '6m', '1y', '5y']
    };

    this.fetchHistoricalPrices = this.fetchHistoricalPrices.bind(this);
    this.fetchStockInfo = this.fetchStockInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchStockInfo(this.props.match.params.symbol)
    this.fetchHistoricalPrices(this.props.match.params.symbol, this.state.selectedRange);
  }

  handleChange(event) {
    const { name, value } = event.target;

    console.log(name, value);
    this.setState(({ [name]: value }), () => {
      if (name === 'selectedRange') {
        this.fetchHistoricalPrices(this.props.match.params.symbol, this.state.selectedRange);
      }
    });
  }

  findIndexesOfFirstTradingDays(historicalPrices) {
    const indexesOfFirstTradingDays = {};

    historicalPrices.forEach((day, index) => {
      let currentTargetYear = new Date(day.date).getFullYear();
      if (indexesOfFirstTradingDays[currentTargetYear] === undefined) {
        indexesOfFirstTradingDays[currentTargetYear] = index;
      }
    })

    console.log('findIndexesOfFirstTradingDays', indexesOfFirstTradingDays);

    return indexesOfFirstTradingDays;
  }

  fetchHistoricalPrices(symbol, range) {
    this.props.stockMarketService.getHistoricalPricesByRange(symbol, range)
      .then(historicalPrices => {
        // console.log(historicalPrices);

        if (this.state.selectedRange === '5y') {
          let indexesOfFirstTradingDays = this.findIndexesOfFirstTradingDays(historicalPrices)
          this.setState(({ historicalPrices, indexesOfFirstTradingDays }), () => console.log('After setState', this.state));
        } else {
          this.setState(({ historicalPrices}));
        }
      });
  }
  
  fetchStockInfo(symbol) {
    this.props.stockMarketService.getStockInfo(symbol)
      .then(response => {
        // console.log(response);
        this.setState(({...response}), () => console.log(this.state));
      });
  }

  // From https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
  abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "K", "M", "B","T"];
        var suffixNum = Math.floor( ("" + value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum !== 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 !== 0)  shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
  }

  // From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas(value) {
    let parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  createTickConfiguration() {
    console.log('indexesOfFirstTradingDays.length', this.state.indexesOfFirstTradingDays.length)

    let tickConfiguration = {};
    switch (this.state.selectedRange) {
      case '1d':
        tickConfiguration.maxTicksLimit = 13;
        break;
      case '5dm':
        tickConfiguration.callback = (label) => {
          let labelSplit = label.split('|')
          let date = labelSplit[0];
          let minute = labelSplit[1].trim();
          return (minute === '09:30') ? date : '';
        }
        tickConfiguration.maxTicksLimit = 5;
        break;
      case '1m':
        tickConfiguration.callback = (label) => {
          let labelSplit = label.split(',')
          let date = labelSplit[0];
          return date;
        }
        tickConfiguration.maxTicksLimit = 4;
        break;
      case '6m':
        tickConfiguration.maxTicksLimit = 6;
        break;
      case '1y':
        tickConfiguration.maxTicksLimit = 4;
        break;
      case '5y':
        tickConfiguration.callback = (label, index, ticks) => {
          let labelSplit = label.split(',')
          // let date = labelSplit[0];
          let year = labelSplit[1];

          if (this.state.indexesOfFirstTradingDays.length > 0) {
            let result = (this.state.indexesOfFirstTradingDays[year] === index) ? year : '';

            console.log('RESULT', result);
          
            return result;
          }
          
        }
        tickConfiguration.maxTicksLimit = 6;
        break;
      default:
        break;
    }

    tickConfiguration.maxRotation = 0;
    // tickConfiguration.minRotation = 180;

    return tickConfiguration;
  }

  formatLabels() {
    let labels;
    switch (this.state.selectedRange) {
      case '1d':
        labels = this.state.historicalPrices.map(data => data.minute);
        break;
      case '5dm':
        labels = this.state.historicalPrices.map(data => {
          let date = new Date(data.date)
          const monthName = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          return `${monthName} ${day} | ${data.minute}`;
        });
        break;
      case '1m':
        labels = this.state.historicalPrices.map(data => {
          let date = new Date(data.date)
          const monthName = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const year = date.getFullYear()
          return `${monthName} ${day}, ${year}`;
        });
        break;
      case '6m':
        labels = this.state.historicalPrices.map(data => {
          let date = new Date(data.date)
          const monthName = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const year = date.getFullYear()
          return `${monthName} ${day}, ${year}`;
        });
        break;
      case '1y':
        labels = this.state.historicalPrices.map(data => {
          let date = new Date(data.date)
          const monthName = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const year = date.getFullYear()
          return `${monthName} ${day}, ${year}`;
        });
        break;
      case '5y':
        labels = this.state.historicalPrices.map(data => {
          let date = new Date(data.date)
          const monthName = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const year = date.getFullYear()
          return `${monthName} ${day}, ${year}`;
        });
        break;
      default:
        labels = this.state.historicalPrices.map(data => data.minute);
        break;
    }

    console.log(labels);

    return labels;
  }

  createChartConfiguration() {
    console.log('createChartConfiguration called')
    let priceChange = (this.state.latestPrice - this.state.previousClose).toFixed(2);
    let chartProps = {
      type: 'line',
      data: {
        labels: this.formatLabels(),
        datasets: [
          {
            label: 'Price',
            data: this.state.historicalPrices.map(data => data.close),
            backgroundColor: (priceChange > 0) ? CHART_FILL_GREEN : CHART_FILL_RED,
            borderColor: (priceChange > 0) ? CHART_BORDER_GREEN : CHART_BORDER_RED,
            borderWidth: 1,
            pointRadius: 0.5
          }
        ],
      },
      options: {
        legend: {
          display: false
        },
        maintainAspectRatio: true,
        scales: {
          xAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
              },
              ticks: this.createTickConfiguration()
            }
          ],
          yAxes: [{
            ticks: {
              beginAtZero: false,
            }
          }]
        }
      }
    };


    return chartProps;
  }

  renderCompanyName = () => (
    <div>
      <h1 className="title is-size-2" style={{display: 'inline'}}>{this.props.match.params.symbol.toUpperCase()}</h1>
      <p className="subtitle is-size-2" style={{display: 'inline'}}> | </p>
      <h2 className="subtitle is-size-2" style={{display: 'inline'}}>{this.state.companyName}</h2>
    </div>
  );

  renderPriceInfo() {
    let priceChangeIcon, priceChangeColor, priceChangeText;
      let priceChange = (this.state.latestPrice - this.state.previousClose).toFixed(2);
      let priceChangePercent = (priceChange / this.state.previousClose).toFixed(2);
      if (priceChange > 0) {
        priceChangeIcon = (
          <span className="icon">
            <i className="fas fa-caret-up"></i>
          </span>
        );
        priceChangeColor = 'has-text-success';
      } else if (priceChange < 0){
        priceChangeIcon = (
          <span className="icon">
            <i className="fas fa-caret-down"></i>
          </span>
        );
        priceChangeColor = 'has-text-danger';
      } else {
        priceChangeColor = ''
      }

      priceChangeText = <div className={`subtitle is-size-5 ${priceChangeColor}`}> {priceChangeIcon} {priceChange} ({priceChangePercent})% </div>

    return (
      <h2 className="subtitle is-size-4">
        {this.state.latestPrice}
        {priceChangeText}
      </h2>
    );
  }

  renderChart = () => {
    return (
      <div className="box">
        <StockChart {...this.createChartConfiguration()} />
        {/* <canvas id="chart"></canvas> */}
        <div className="buttons has-addons is-centered">
          {
            this.state.timeRanges.map(range =>
              <button 
                className={`button ${(this.state.selectedRange === range) ? 'is-active' : ''}`}
                key={range}
                name='selectedRange' 
                onClick={this.handleChange} 
                value={timeRanges[range]}>
                {range.toUpperCase()}
              </button>
            )
          }
        </div>
      </div>
    );
  }

  renderHoldings = () => (
    <div className='box content'>
      <table>
        <thead>
          <tr>
            <th colSpan='2'>Your holdings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='has-text-left has-text-weight-bold'>Shares</td>
            <td>{}</td>
          </tr>
          <tr>
            <td className='has-text-left has-text-weight-bold'>Market value</td>
            <td>{}</td>
          </tr>
          <tr>
            <td className='has-text-left has-text-weight-bold'>Average price</td>
            <td>{}</td>
          </tr>
          <tr>
            <td className='has-text-left has-text-weight-bold'>Today's return</td>
            <td>{}</td>
          </tr>
          <tr>
            <td className='has-text-left has-text-weight-bold'>All time return</td>
            <td>{}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  renderStatistics = () => (
    <div className='box content'>
      <table>
        <thead>
          <tr>
            <th colSpan='2'>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='has-text-left has-text-weight-bold'>Open</td>
            <td>{this.state.open?.toFixed(2)}</td>
          </tr>
          <tr>
            <td className='has-text-left has-text-weight-bold'>High</td>
            <td>{this.state.high?.toFixed(2)}</td>
          </tr>
          <tr>
            <td className='has-text-left has-text-weight-bold'>Low</td>
            <td>{this.state.low?.toFixed(2)}</td>
          </tr>
          <tr>
            <td className='has-text-left has-text-weight-bold'>Market cap</td>
            <td>{this.state.marketCap ? this.abbreviateNumber(this.state.marketCap) : null}</td>
          </tr>
          <tr>
            <td className='has-text-left has-text-weight-bold'>Volume</td>
            <td>{this.state.volume ? this.numberWithCommas(this.state.volume) : null}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  render() {
    let view;
    console.log('check', this.state.historicalPrices.length > 0);
    if (this.state.companyName && this.state.historicalPrices.length > 0) { 
      view = (
        <div className='container'>
          {this.renderCompanyName()}
          {this.renderPriceInfo()}
          {this.renderChart()}
          <div className='columns'>
            <div className='column'>
              {this.renderHoldings()}
            </div>
            <div className='column'>
              {this.renderStatistics()}
            </div>
          </div>
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
