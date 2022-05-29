/** @format */

import {
  FunctionComponent,
  ReactNode,
  RefObject,
  useRef,
  useState,
} from 'react';
import ReactModal from 'react-modal';
import { Paragraph, Box, Spinner, Button, Input, Label } from 'theme-ui';
import { T_Denomination } from '../lib/types';

import { download, parseNote, withdraw } from '../lib/utils/index';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

ReactModal.setAppElement('#__next');

const Modal: FunctionComponent<{
  modalIsOpen: boolean;
  closeModal: () => void;
  isDeposit: () => boolean;
  showSpinnerDeposit: boolean;
  note: string;
  denomination: T_Denomination;
}> = ({
  modalIsOpen,
  closeModal,
  isDeposit,
  showSpinnerDeposit,
  note,
  denomination,
}) => {
  function afterOpenModal() {}

  return (
    <ReactModal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <Paragraph>
        {' '}
        {isDeposit() ? (
          <Deposit
            showSpinner={showSpinnerDeposit}
            note={note}
            denomination={denomination}
          />
        ) : (
          <Withdraw closeModal={closeModal} denomination={denomination} />
        )}
      </Paragraph>
    </ReactModal>
  );
};

const Wrapper: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        px: [44],
        borderRadius: [10],
        cursor: 'pointer',
        transition: '0.3s',
        textAlign: 'center',
        minWidth: [280, 400],
      }}
    >
      {children}
    </Box>
  );
};

const Deposit: FunctionComponent<{
  showSpinner: boolean;
  note: string;
  denomination: string;
}> = ({ showSpinner, note, denomination }) => {
  return (
    <Wrapper>
      <h2> {showSpinner ? 'In Progress' : 'Transaction Completed 🚀'} </h2>
      <Paragraph>
        {showSpinner
          ? 'please wait while we are processing your transaction'
          : 'your transaction was successfull, please save the following note on your system to withdraw in future.'}
      </Paragraph>
      <br />
      {showSpinner ? (
        <Spinner color="purple" />
      ) : (
        <Box>
          <Paragraph sx={{ fontWeight: 'bold', bg: 'wheat', p: [2] }}>
            {note}
          </Paragraph>
          <Button
            onClick={() => {
              download('note.txt', note);
            }}
            sx={{ mt: [4] }}
          >
            Download
          </Button>
        </Box>
      )}
    </Wrapper>
  );
};

const Withdraw: FunctionComponent<{
  closeModal: () => void;
  denomination: T_Denomination;
}> = ({ closeModal, denomination }) => {
  const [showSpinner, setShowSpinner] = useState(!true);
  const [transactionDone, setTransactionDone] = useState(!true);

  const noteRef = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;
  const addressRef = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;

  const onWithdraw = async () => {
    setShowSpinner(true);

    const note = noteRef.current?.value;
    const recipient = addressRef.current?.value;

    if (!note || !recipient) {
      !note
        ? alert('please enter a note')
        : alert('please enter recipient address');
    } else {
      try {
        const { deposit } = parseNote(note);
        console.log('deposit =>', deposit);
        await withdraw(deposit, recipient, denomination);
        setTransactionDone(true);
      } catch (err) {
        let alertMessage: undefined | string;

        if (
          typeof err === 'object' &&
          err?.toString &&
          typeof err?.toString === 'function'
        ) {
          switch (err.toString()) {
            case 'AssertionError [ERR_ASSERTION]: Merkle tree is corrupted':
              alertMessage = 'Merkle tree is corrupted';
              break;
            case 'AssertionError [ERR_ASSERTION]: The note is already spent':
              alertMessage = 'The note is already spent';
              break;
            case 'AssertionError [ERR_ASSERTION]: The deposit is not found in the tree':
              alertMessage = 'The deposit is not found in the tree';
              break;
          }

          console.log('error =>', err.toString());
          if (err.toString() === 'Error: The note has invalid format') {
            alert('The note has invalid format');
          }
        } else {
          alert('something went wrong, please try again');
        }

        setShowSpinner(false);
        setTransactionDone(false);
        closeModal();

        if (alertMessage) {
          alert(alertMessage);
        }
      }
    }
  };

  return (
    <Wrapper>
      <h2>
        {showSpinner
          ? 'In Progress'
          : transactionDone
          ? 'Withdraw was successful 🚀'
          : 'Withdraw Note 🧞‍♀️'}{' '}
      </h2>

      {!showSpinner && !transactionDone ? (
        <>
          <Label>Enter Deposit Note </Label>
          <Input
            sx={{ p: [2] }}
            placeholder="tunnel-eth-0.1-5777-0x35c88ba8d9743a4a9455f13992d8353c4ec91...."
            ref={noteRef}
          />

          <br />
          <Label>Enter Recipient</Label>
          <Input
            placeholder="0x24a8bB5C121050DA70b2577d8FA6da9a...."
            ref={addressRef}
          />
          <Button sx={{ mt: [4] }} onClick={onWithdraw}>
            Withdraw
          </Button>
        </>
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

export default Modal;
