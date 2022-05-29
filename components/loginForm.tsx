/** @format */
/**@jsxImportSource theme-ui */

import { FunctionComponent, RefObject, useRef, useState } from 'react';
import { Box, Button, Flex, Input, Label, Paragraph, Switch } from 'theme-ui';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { addPerson, connectWallet, addUser } from '../lib/utils';
import { T_Denomination } from '../lib/types';

const Form: FunctionComponent<{
  connected: boolean;
  ethereum: MetaMaskInpageProvider;
}> = ({ connected, ethereum }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showSpinnerDeposit, setShowSpinnerDeposit] = useState(true);
  const [note, setNote] = useState('');
  const [denomination, setDenomination] = useState<T_Denomination>('0.1');

  const passwordRef = useRef() as RefObject<HTMLInputElement>;

  return (
    <Box>
      {connected ? (
        <Input
          ref={passwordRef}
          sx={{ mx: ['auto'], maxWidth: [280], pl: [3] }}
          placeholder="Enter the Voting key"
        />
      ) : (
        <></>
      )}
      <Box sx={{ textAlign: 'center', mt: [!connected ? 2 : 5] }}>
        {connected ? (
          <>
            <Button
              onClick={async () => {
                await addUser(
                  passwordRef.current?.value ? passwordRef.current.value : ''
                );
              }}
            >
              Add Voter
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              connectWallet(ethereum);
            }}
            sx={{ variant: 'buttons.connect' }}
          >
            Connect
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Form;
