import { Component, Fragment } from 'react'
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export default class Overview extends Component {

  constructor() {
    super();
    this.state = {
      loaded: true,
      portfolios: [
        { 
          name: 'Personal',
          value: 11030
        },
        { 
          name: 'RRSP',
          value: 48390
        },
        { 
          name: 'TFSA',
          value: 110000
        }
      ]
    };
  }

  // From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas(value) {
    let parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  calculateTotalValue = () => this.state.portfolios.reduce((prev, curr) => prev + curr.value, 0);

  viewPortfolio = (name) => {
    console.log('Viewing portfolio', name);
  }

  renderTotalValue = () => (
    <Fragment>
      <Typography variant="h4" component="span">Your holdings</Typography>
      <Typography variant="h2" component="span" display="block" gutterBottom>${this.numberWithCommas(this.calculateTotalValue())}</Typography>
    </Fragment>
  )

  renderPortfolioList = () => (
    <Box display="flex" flexDirection="column" m={5}>
      <Typography variant="h4" component="span">Portfolios</Typography>
      {
        this.state.portfolios.map(portfolio => 
          <Box m={1} onClick={() => this.viewPortfolio(portfolio.name)} style={{ cursor: 'pointer' }}>
            <Paper variant="outlined">
              <Typography variant="h5" component="span">{portfolio.name}</Typography>
              <Typography variant="subtitle2" component="div">Market value</Typography>
              <Typography variant="subtitle1" component="div">${this.numberWithCommas(portfolio.value)}</Typography>
            </Paper>
          </Box>
        )
      }
    </Box>
  )

  renderPage = () => (
    <Container>
      {this.renderTotalValue()}
      {this.renderPortfolioList()}
    </Container>
  );

  renderLoadingState = () => (
    <div className='container'>
      <p> Loading...</p>
    </div>
  );

  render() {
    return this.state.loaded ? this.renderPage() : this.renderLoadingState();
  }
}
