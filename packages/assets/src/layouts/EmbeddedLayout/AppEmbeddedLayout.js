import React from 'react';
import {Frame, Loading, Toast} from '@shopify/polaris';
import PropTypes from 'prop-types';
import {useStore} from '@assets/reducers/storeReducer';
import {closeToast} from '@assets/actions/storeActions';
// import {HomeIcon, NotificationFilledIcon, SettingsFilledIcon} from '@shopify/polaris-icons';

/**
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
function AppEmbeddedLayout({children}) {
  const {state, dispatch} = useStore();
  const {loading, toast} = state;

  // const navigation = (
  //   <Navigation location="/">
  //     <Navigation.Section
  //       items={[
  //         {
  //           url: '#',
  //           label: 'Home',
  //           icon: HomeIcon
  //         },
  //         {
  //           url: '/notifications',
  //           label: 'Notifications',
  //           icon: NotificationFilledIcon
  //         },
  //         {
  //           url: '/settings',
  //           label: 'Settings',
  //           icon: SettingsFilledIcon
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
