import React from 'react';
import { getData } from '../helpers/http';
import { IEX_API_SANDBOX } from '../constants';
import { IEX_API_KEY_SANDBOX } from '../api-keys';

const { createContext, useContext } = React;

export const StockMarketServiceContext = createContext(null);

export const StockMarketServiceProvider = (props) => {
  const value = {
    getStockInfo: props.getStockInfo || getStockInfo,
    searchStocks: props.searchStocks || searchStocks,
    getHistoricalPricesByRange: props.getHistoricalPricesByRange || getHistoricalPricesByRange,
    getHistoricalPricesFromPastDay: props.getHistoricalPricesFromPastDay || getHistoricalPricesFromPastDay
  };

  return (
    <StockMarketServiceContext.Provider value={value}>
      {props.children}
    </StockMarketServiceContext.Provider>
  );
};

export const useStockMarketServiceContext = () => {
  return useContext(StockMarketServiceContext);
};

const getStockInfo = (symbol) => {
  return getData(IEX_API_SANDBOX + '/stock/' + symbol.toLowerCase() + '/quote?token=' + IEX_API_KEY_SANDBOX);
}

const searchStocks = (fragment) => {
  return getData(IEX_API_SANDBOX + '/search/' + fragment.toLowerCase() + '?token=' + IEX_API_KEY_SANDBOX)
}

const getHistoricalPricesByRange = (symbol, range) => {
  // switch (range) {
  //   case '1d':
  //     return getHistoricalPricesFromPastDay(symbol);
  //   case '5d':
  //     return getHistoricalPricesFromPastFiveDays(symbol);
  //   case '1m':
  //     return getHistoricalPricesFromPastMonth(symbol);
  //   case '6m':
  //     return getHistoricalPricesFromPastSixMonths(symbol);
  //   case '1y':
  //     return getHistoricalPricesFromPastYear(symbol);
  //   case '5y':
  //     return getHistoricalPricesFromPastFiveYears(symbol);
  //   default:
  //     return getHistoricalPricesFromPastDay(symbol);
  // }

  return getData(IEX_API_SANDBOX + '/stock/' + symbol.toLowerCase() + '/chart/' + range + '?token=' + IEX_API_KEY_SANDBOX);
}

const getHistoricalPricesFromPastDay = (symbol) => {
  return getData(IEX_API_SANDBOX + '/stock/' + symbol.toLowerCase() + '/chart/1d' + '?token=' + IEX_API_KEY_SANDBOX);
}

const getHistoricalPricesFromPastFiveDays = (symbol) => {
  return getData(IEX_API_SANDBOX + '/stock/' + symbol.toLowerCase() + '/chart/5dm' + '?token=' + IEX_API_KEY_SANDBOX);
}

const getHistoricalPricesFromPastMonth = (symbol) => {
  return getData(IEX_API_SANDBOX + '/stock/' + symbol.toLowerCase() + '/chart/1m' + '?token=' + IEX_API_KEY_SANDBOX);
}

const getHistoricalPricesFromPastSixMonths = (symbol) => {
  return getData(IEX_API_SANDBOX + '/stock/' + symbol.toLowerCase() + '/chart/6m' + '?token=' + IEX_API_KEY_SANDBOX);
}

const getHistoricalPricesFromPastYear = (symbol) => {
  return getData(IEX_API_SANDBOX + '/stock/' + symbol.toLowerCase() + '/chart/1y?chartCloseOnly=true&chartInterval=30' + '&?token=' + IEX_API_KEY_SANDBOX);
}

const getHistoricalPricesFromPastFiveYears = (symbol) => {
  return getData(IEX_API_SANDBOX + '/stock/' + symbol.toLowerCase() + '/chart/5y?chartCloseOnly=true&chartInterval=30' + '&?token=' + IEX_API_KEY_SANDBOX);
}
