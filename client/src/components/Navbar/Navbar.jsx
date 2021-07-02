import React from 'react';
// import { Link } from 'react-router-dom';
import StockSearch from '../StockSearch/StockSearchComponent';
import { StockMarketServiceProvider } from '../../services/StockMarketService';

export default function Navbar() {
  return (        
    <nav className='navbar' role='navigation' aria-label='main navigation'>
      <div className='navbar-brand'>
        <a className="navbar-item" href="/home">
          <i className="fas fa-chart-pie fa-2x"></i>
        </a>
        <button className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbar">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div className='navbar-menu'> 
        <div className='navbar-start'>
          {/* <Link className='navbar-item' to='/'>
            Portfolio
          </Link>
          <Link className='navbar-item' to='/profile'>
            Profile
          </Link> */}
          <div className='navbar-item'>
            <StockMarketServiceProvider>
              <StockSearch />
            </StockMarketServiceProvider>
          </div>
          
        </div>
        <div className='navbar-end'>
          
        </div>
      </div>
    </nav>
  );
}
