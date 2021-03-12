import React from 'react';
import { getData } from '../helpers/http';
import { IEX_API_SANDBOX } from '../constants';
import { IEX_API_KEY_PROD, IEX_API_KEY_SANDBOX } from '../api-keys';

const { createContext, useContext } = React;

export const StockMarketServiceContext = createContext(null);

export const StockMarketServiceProvider = (props) => {
  const value = {
    getStockInfo: props.getStockInfo || getStockInfo,
    searchStocks: props.searchStocks || searchStocks
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
  return getData(IEX_API_SANDBOX + '/stock/' + symbol + '/quote?token=' + IEX_API_KEY_SANDBOX);
}

const searchStocks = (fragment) => {
  return getData(IEX_API_SANDBOX + '/search/' + fragment + '?token=' + IEX_API_KEY_SANDBOX)
}
