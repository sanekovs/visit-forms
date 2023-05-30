import { useState } from 'preact/hooks';
import {
  TextInput,
  Button,
  InlineLoading,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'carbon-components-react';

function ModalComponent() {
  const [ open, setOpen ] = useState(false);
  const [ page, setPage ] = useState(1);
  const [ textInput, setTextInput ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleGenerateForm = () => {
    setPage(2);
    setLoading(true);
  };

  const handleContinueToBuild = () => {

    // Add your continue to build manually logic here
  };

  const closeModal = () => {
    setOpen(false);
    setPage(1);
    setTextInput('');
  };

  const modalBody = page === 1 ? (
    <>
      <h3>Generate forms with the power of AI</h3>
      <p>Build Custom Forms with Ease using Artificial intelligence.
        Just enter what type of form you need and let the AI magic happen.
      </p>
      <TextInput
        id="text-input"
        placeholder="A form for an American standards request"
        labelText="E.g. A form for a joining employee; loan approval request form; whatever you want form"
        value={ textInput }
        onChange={ handleInputChange }
      />
      <div className="info-box">
        <h4>Disclaimer headline</h4>
        <p>This is a beautiful disclaimer message to make sure users are able to know what happens to their beloved data.</p>
      </div>
    </>
  ) : (
    <>
      <InlineLoading description="Generating..." status={ loading ? 'active' : 'finished' } />
      <p><strong>{textInput}</strong></p>
    </>
  );

  return (
    <div>
      <Button onClick={ () => setOpen(true) }>
        Open Modal
      </Button>
      <ComposedModal open={ open } onClose={ closeModal }>
        <ModalHeader title="AI Form Generator" />
        <ModalBody>
          {modalBody}
        </ModalBody>
        <ModalFooter>
          {page === 1 &&
            <>
              <Button kind="secondary" onClick={ handleContinueToBuild }>
                Continue to build manually
              </Button>
              <Button kind="primary" onClick={ handleGenerateForm }>
                Generate form
              </Button>
            </>
          }
        </ModalFooter>
      </ComposedModal>
    </div>
  );
}

export default ModalComponent;