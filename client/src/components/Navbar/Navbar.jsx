import React from 'react';
import { Link } from 'react-router-dom';
import StockSearch from '../StockSearch/StockSearchComponent';
import { StockMarketServiceProvider } from '../../services/StockMarketService';

export default function Navbar() {
  return (        
    <nav className='navbar' role='navigation' aria-label='main navigation'>
      <div className='navbar-brand'>
        <a className="navbar-item" href="/home">
          <img src="https://bulma.io/images/bulma-logo.png" alt="logo" width="112" height="28"/  >
        </a>
        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div className='navbar-menu'> 
        <div className='navbar-start'>
          {/* <Link className='navbar-item' to='/'>
            Portfolio
          </Link>
          <Link className='navbar-item' to='/profile'>
            Profile
          </Link> */}
          <StockMarketServiceProvider>
            <StockSearch />
          </StockMarketServiceProvider>
        </div>
        <div className='navbar-end'>
          
        </div>
      </div>
    </nav>
  );
}
