import React from 'react';
import ReactModal from 'react-modal';

const Modal = ({ show, close, width, children }) => (
  <ReactModal
    isOpen={show}
    overlayClassName={{
      base: "ReactModal__Overlay fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-black bg-opacity-70 z-30",
      afterOpen: "ReactModal__Overlay--after-open",
      beforeClose: "ReactModal__Overlay--before-close"
    }}
    className={{
      base: `ReactModal__Content ${width} max-h-3/4 overflow-scroll px-8 py-6 rounded-xl bg-white`,
      afterOpen: "ReactModal__Content--after-open",
      beforeClose: "ReactModal__Content--before-close"
    }}
    shouldCloseOnEsc={true}
    shouldCloseOnOverlayClick={true}
    onAfterOpen={() => { document.body.style.overflow = 'hidden' }}
    onRequestClose={close}
    onAfterClose={() => { document.body.removeAttribute('style') }}
    closeTimeoutMS={250}
  >
    {children}
  </ReactModal>
)

export default Modal;
