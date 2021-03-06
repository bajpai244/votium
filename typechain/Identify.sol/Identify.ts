/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export interface IdentifyInterface extends utils.Interface {
  functions: {
    "addPerson(address,string)": FunctionFragment;
    "admin()": FunctionFragment;
    "authenticate(bytes,uint256[])": FunctionFragment;
    "users(address)": FunctionFragment;
    "verifier()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addPerson"
      | "admin"
      | "authenticate"
      | "users"
      | "verifier"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addPerson",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "admin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "authenticate",
    values: [BytesLike, BigNumberish[]]
  ): string;
  encodeFunctionData(functionFragment: "users", values: [string]): string;
  encodeFunctionData(functionFragment: "verifier", values?: undefined): string;

  decodeFunctionResult(functionFragment: "addPerson", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "admin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "authenticate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "users", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "verifier", data: BytesLike): Result;

  events: {};
}

export interface Identify extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IdentifyInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addPerson(
      _address: string,
      _passwordHash: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    authenticate(
      _proof: BytesLike,
      pubSignals: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    users(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        nonce: BigNumber;
        active: BigNumber;
        passwordHash: string;
      }
    >;

    verifier(overrides?: CallOverrides): Promise<[string]>;
  };

  addPerson(
    _address: string,
    _passwordHash: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  admin(overrides?: CallOverrides): Promise<string>;

  authenticate(
    _proof: BytesLike,
    pubSignals: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  users(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, string] & {
      nonce: BigNumber;
      active: BigNumber;
      passwordHash: string;
    }
  >;

  verifier(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    addPerson(
      _address: string,
      _passwordHash: string,
      overrides?: CallOverrides
    ): Promise<void>;

    admin(overrides?: CallOverrides): Promise<string>;

    authenticate(
      _proof: BytesLike,
      pubSignals: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    users(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        nonce: BigNumber;
        active: BigNumber;
        passwordHash: string;
      }
    >;

    verifier(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    addPerson(
      _address: string,
      _passwordHash: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    authenticate(
      _proof: BytesLike,
      pubSignals: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    users(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    verifier(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addPerson(
      _address: string,
      _passwordHash: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    authenticate(
      _proof: BytesLike,
      pubSignals: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    users(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    verifier(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
