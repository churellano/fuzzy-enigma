import { Component, Fragment } from 'react'
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const createData = (name, positions, cash, marketValue, dayProfitAndLoss, totalProfitAndLoss) => ({ name, positions, cash, marketValue, dayProfitAndLoss, totalProfitAndLoss });

const previousData = [
  createData('Personal', 11, 1200, 30000, 24, 4.0),
  createData('RRSP', 5, 1550, 250000, 4.3),
  createData('TFSA', 6, 2000, 120000, 24, 6.0),
]

const currentData = [
  createData('Personal', 11, 1200, 30000, 24, 4.0),
  createData('RRSP', 5, 1550, 250000, 4.3),
  createData('TFSA', 6, 2000, 120000, 24, 6.0),
];

const rows = [
  {
    name: 'Personal',
    positions: 3,
    cash: 1500,
    marketValue: 125000,
    dayProfitAndLoss: 3000,
    totalProfitAndLoss: 30000
  },
  {
    name: 'RRSP',
    positions: 3,
    cash: 1500,
    marketValue: 125000,
    dayProfitAndLoss: 3000,
    totalProfitAndLoss: 30000
  },
  {
    name: 'TFSA',
    positions: 3,
    cash: 1500,
    marketValue: 125000,
    dayProfitAndLoss: 3000,
    totalProfitAndLoss: 30000
  }
];

export default class Overview extends Component {

  constructor() {
    super();
    this.state = {
      loaded: true,
      portfolios: rows
    };
  }

  componentDidMount() {
    // this.setState(({ portfolios: rows }));
  }

  getCurrentPortfolioData = (previousDayPortfolios, currentPortfolios) => {
    let portfolios = [];
    
    currentPortfolios.forEach(portfolio => {
      let updatedPortfolio = {
        name: portfolio.name
      };
      let previousDayPortfolio = previousDayPortfolios.find(x => x.name === portfolio.name);
      if (previousDayPortfolio) {
        const marketValueChange = portfolio.marketValue - previousDayPortfolio.marketValue;
        updatedPortfolio.dayProfitAndLoss = marketValueChange;
        updatedPortfolio.dayProfitAndLossPercent = (previousDayPortfolio.marketValue === 0) ? (marketValueChange / previousDayPortfolio.marketValue) : null;
      }

    });

    return portfolios;
  }

  // From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas(value) {
    let parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  calculateTotalValue = () => this.state.portfolios.reduce((prev, curr) => prev + curr.marketValue, 0);

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
      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Portfolio Name</TableCell>
            <TableCell align="right">Positions</TableCell>
            <TableCell align="right">Cash</TableCell>
            <TableCell align="right">Market value</TableCell>
            <TableCell align="right">Total equity</TableCell>
            <TableCell align="right">Today's P&L</TableCell>
            <TableCell align="right">Total P&L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                <a onClick={() => this.viewPortfolio(row.name)} style={{ cursor: "pointer" }}>{row.name}</a>
              </TableCell>
              <TableCell align="right">{row.positions}</TableCell>
              <TableCell align="right">${row.cash}</TableCell>
              <TableCell align="right">${row.marketValue}</TableCell>
              <TableCell align="right">${row.cash + row.marketValue}</TableCell>
              <TableCell align="right">{0}%</TableCell>
              <TableCell align="right">{0}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
