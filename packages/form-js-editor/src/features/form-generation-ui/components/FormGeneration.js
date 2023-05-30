import { useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';

export default (props) => {

  const {
    components,
    useService
  } = props;

  const {
    Fill
  } = components;

  const [ modalIsOpen, setModalIsOpen ] = useState(false);

  return (
    <>
      <Fill slot="editor-palette__footer">
        <button onClick={ () => { setModalIsOpen((b) => !b); } }>AI form generator 🔥</button>
      </Fill>
      { modalIsOpen && <Modal onMouseDown={ () => setModalIsOpen(false) } useService={ useService } /> }
    </>
  );
};

const Modal = (props) => createPortal(<ModalContent { ...props } />, document.body);

const ModalContent = ({ onMouseDown, useService }) => {

  const selection = useService('selection');

  return <div className="modal" onMouseDown={ () => {} }>
    <div className="modal-content">
      <span className="close">&times;</span>
      <button onClick={ () => { selection.clear(); } }>Deselect current field</button>
    </div>
  </div>;
};