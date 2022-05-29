import { MetaMaskInpageProvider } from "@metamask/providers";

export type MetaMaskMethod<T> = (ethereum: MetaMaskInpageProvider) => Promise<T>

export type T_Denomination = "0.1" | "1" | "10" | "100" | "1000"

export type T_Deposit = { nullifier: BigInt, secret: BigInt, preimage: Buffer, commitment: BigInt, commitmentHex: string, nullifierHash: BigInt, nullifierHex: string }