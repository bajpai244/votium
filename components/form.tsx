/** @format */
/**@jsxImportSource theme-ui */

import { FunctionComponent, RefObject, useRef, useState } from 'react';
import { Box, Button, Image, Input, Label, Paragraph, Switch } from 'theme-ui';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { addPerson, connectWallet, vote } from '../lib/utils';
import { T_Denomination } from '../lib/types';

const Form: FunctionComponent<{
  connected: boolean;
  ethereum: MetaMaskInpageProvider;
  yes: number;
  no: number;
  syncState: () => Promise<void>;
}> = ({ connected, ethereum, yes, no, syncState }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showSpinnerDeposit, setShowSpinnerDeposit] = useState(true);
  const [note, setNote] = useState('');
  const [denomination, setDenomination] = useState<T_Denomination>('0.1');

  const proofRef = useRef() as RefObject<HTMLInputElement>;

  return (
    <Box>
      {connected ? (
        <Box sx={{ textAlign: 'center' }}>
          <Image src="data:image/jpeg;base64,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" />
          <h1>Should we buy this RAD NFT???</h1>
          <Input
            ref={proofRef}
            placeholder="enter proof"
            sx={{ maxWidth: [300], mx: ['auto'] }}
          />
          <br />
          <h3>Yes = {yes}</h3>
          <h3>No = {no}</h3>
          <Button
            onClick={async () => {
              const proofData = proofRef.current?.value;

              if (proofData) {
                await vote(proofData);
                await syncState();
              }
            }}
          >
            Yes!!!
          </Button>
          <Button
            onClick={() => {
              async () => {
                const proofData = proofRef.current?.value;

                if (proofData) {
                  await vote(proofData);
                  await syncState();
                }
              };
            }}
            sx={{ mx: [3], bg: 'orange' }}
          >
            Nope!!!
          </Button>
        </Box>
      ) : (
        <></>
      )}
      <Box sx={{ textAlign: 'center', mt: [!connected ? 2 : 5] }}>
        {connected ? (
          <></>
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
