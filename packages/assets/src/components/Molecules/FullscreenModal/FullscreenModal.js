import React, {useContext, useEffect} from 'react';
import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';
import PropTypes from 'prop-types';
import {MaxModalContext} from '@assets/contexts/maxModalContext';
import {useHistory} from 'react-router-dom';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const FullscreenModal = () => {
  const {
    title = 'max modal 1',
    actionList = [],
    modalSrc,
    openMaxModal,
    setOpenMaxModal
  } = useContext(MaxModalContext);
  // const shopify = useAppBridge();

  const history = useHistory();

  // useEffect(() => {
  //   if (open) {
  //     shopify.modal.show(id).then();
  //   } else {
  //     shopify.modal.hide(id).then();
  //   }
  // }, [open]);

  if (!modalSrc) return null;

  return (
    <Modal
      onHide={() => {
        setOpenMaxModal(false);
        history.goBack();
      }}
      open={openMaxModal}
      id="max-modal-src"
      variant="max"
      src={modalSrc}
    >
      <TitleBar title={title}>
        {actionList.map((action, index) => (
          // eslint-disable-next-line react/no-unknown-property
          <button key={index} variant={action.primary} onClick={() => action.onClick()}>
            {action.title}
          </button>
        ))}
      </TitleBar>
    </Modal>
  );
};

export default FullscreenModal;

FullscreenModal.propTypes = {
  id: PropTypes.string,
  open: PropTypes.bool,
  title: PropTypes.string,
  actionList: PropTypes.array,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
  children: PropTypes.any
};
