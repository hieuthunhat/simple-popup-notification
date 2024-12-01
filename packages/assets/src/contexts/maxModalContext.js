import React, {createContext, useState} from 'react';
import PropTypes from 'prop-types';
import {getUrl} from '@assets/helpers/getUrl';

export const MaxModalContext = createContext({});

export const MaxModalProvider = ({children}) => {
  const [modalSrc, setModalSrc] = useState('');
  const [openMaxModal, setOpenMaxModal] = useState(false);

  const openFullscreen = url => {
    setModalSrc(getUrl(url));
    setOpenMaxModal(true);
  };

  return (
    <MaxModalContext.Provider value={{modalSrc, openMaxModal, setOpenMaxModal, openFullscreen}}>
      {children}
    </MaxModalContext.Provider>
  );
};

MaxModalProvider.propTypes = {
  children: PropTypes.any
};
