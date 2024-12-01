import React from 'react';
import {Frame, Loading, Toast} from '@shopify/polaris';
import PropTypes from 'prop-types';
import {useStore} from '@assets/reducers/storeReducer';
import {closeToast} from '@assets/actions/storeActions';
import FullscreenModal from '@assets/components/Molecules/FullscreenModal';

/**
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
function AppEmbeddedLayout({children}) {
  const {state, dispatch} = useStore();
  const {loading, toast} = state;

  return (
    <Frame>
      <FullscreenModal />
      {children}
      {loading && <Loading />}
      {toast && <Toast onDismiss={() => closeToast(dispatch)} {...toast} />}
    </Frame>
  );
}

AppEmbeddedLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppEmbeddedLayout;
