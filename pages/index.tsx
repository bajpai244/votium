/**
 * @format
 * @jsxImportSource theme-ui
 */

/** @format */

import { MetaMaskInpageProvider } from '@metamask/providers';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { Container } from 'theme-ui';
import { Header, Form, Loading } from '../components/index';
import { checkIfWalletIsConnected, makeDeposit } from '../lib/utils';
import { getContract } from '../lib/utils/ethersUtils';

const Home: NextPage = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [yes, setYes] = useState(0);
  const [no, setNo] = useState(0);

  let ethereumRef = useRef({ ethereum: MetaMaskInpageProvider });

  const refreshData = async () => {
    const contract = await getContract();
    const yesCount = await contract.yes();
    const noCount = await contract.no();

    if (yesCount.toNumber() != yes || noCount.toNumber() != no) {
      setYes(yesCount.toNumber());
      setNo(noCount.toNumber());
    }
  };

  useEffect(() => {
    refreshData();

    (async () => {
      const { ethereum } = window;

      // TODO: this exception should be handled
      if (!ethereum) {
        throw 'no inpage ethereum provider';
      }

      //NOTE: Figure out why typescript is giving error
      ethereumRef.current.ethereum = ethereum;
      setLoading(false);

      // ethereumRef.current.ethereum = ethereum;

      const walletIsConnected = await checkIfWalletIsConnected(ethereum);

      console.log('->', walletIsConnected);

      if (walletIsConnected !== connected) {
        setConnected(walletIsConnected);
      }

      console.log('walletIsConnected =>', walletIsConnected);
    })();

    const interval = setInterval(async () => {
      if (ethereumRef.current.ethereum) {
        const connectStatus = await checkIfWalletIsConnected(
          ethereumRef.current.ethereum
        );

        if (connectStatus !== connected) {
          setConnected(connectStatus);
        }
      }
    }, 1000);

    () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container>
      {!loading ? (
        <>
          <Header />
          <Form
            connected={connected}
            ethereum={ethereumRef.current.ethereum}
            yes={yes}
            no={no}
            syncState={refreshData}
          />
        </>
      ) : (
        <Loading />
      )}
    </Container>
  );
};

export default Home;
