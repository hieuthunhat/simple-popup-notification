import React from 'react';
import PropTypes from 'prop-types';
import {NavMenu} from '@shopify/app-bridge-react';
import {Link} from 'react-router-dom';

export default function AppBridgeProvider({children}) {
  const fullNavLink = [
    {
      label: 'Samples',
      destination: '/samples'
    },
    {
      label: 'Settings',
      destination: '/settings'
    },
    {
      label: 'Fullscreen page a',
      destination: '/fullscreen-page-a'
    }
  ];

  return (
    <>
      <NavMenu>
        <Link to="/embed" rel="home">
          Home
        </Link>
        {fullNavLink.map(link => (
          <Link to={link.destination} key={link.destination}>
            {link.label}
          </Link>
        ))}
      </NavMenu>
      {children}
    </>
  );
}

AppBridgeProvider.propTypes = {
  children: PropTypes.any
};
