import React from 'react';
import {Frame, Loading, Toast} from '@shopify/polaris';
import PropTypes from 'prop-types';
// import {useLocation} from 'react-router-dom';
import {useStore} from '@assets/reducers/storeReducer';
import {closeToast} from '@assets/actions/storeActions';
// import {HomeIcon, NotificationFilledIcon, SettingsFilledIcon} from '@shopify/polaris-icons';
// import {routePrefix} from '@assets/config/app';

/**
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
function AppEmbeddedLayout({children}) {
  const {state, dispatch} = useStore();
  const {loading, toast} = state;
  // const location = useLocation();

  // const navigation = (
  //   <Navigation location={location.pathname}>
  //     <Navigation.Section
  //       items={[
  //         {
  //           url: routePrefix + '/',
  //           label: 'Home',
  //           icon: HomeIcon,
  //           selected: location.pathname === routePrefix + '/'
  //         },
  //         {
  //           url: routePrefix + '/notifications',
  //           label: 'Notifications',
  //           icon: NotificationFilledIcon,
  //           selected: location.pathname === routePrefix + '/notifications'
  //         },
  //         {
  //           url: routePrefix + '/settings',
  //           label: 'Settings',
  //           icon: SettingsFilledIcon,
  //           selected: location.pathname === routePrefix + '/settings'
  //         }
  //       ]}
  //     />
  //   </Navigation>
  // );

  return (
    <Frame
    // navigation={navigation}
    >
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
