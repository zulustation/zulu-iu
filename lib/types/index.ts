import { AssetId } from "@zulustation/sdk/dist/types";
import { Asset } from "@zulustation/types/dist/interfaces";
import Decimal from "decimal.js";
import { NextPage } from "next";
import { FC } from "react";

export enum SupportedParachain {
  KUSAMA = "kusama",
  ROCOCO = "rococo",
  BSR = "bsr",
  CUSTOM = "custom",
}

export const supportedParachainToString = (chain: SupportedParachain) =>
  chain === SupportedParachain.BSR
    ? "BSR Testnet"
    : chain === SupportedParachain.ROCOCO
    ? "Rcococo Testnet"
    : chain === SupportedParachain.KUSAMA
    ? "Kusama Live"
    : "Custom";

export type Theme = "light" | "dark";

export type NotificationType = "Error" | "Info" | "Success";

// Add Layout member to NextPage so it pages can be integrated in layouts for
// code reuse
export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: FC | (() => JSX.Element);
};

export type PoolsListQuery = {
  page: number;
};

export type PaginationOptions = {
  page: number;
  pageSize: number;
};

export interface SharesBalances {
  yes: Decimal;
  no: Decimal;
}

export interface SelectOption {
  value: number | string;
  label: string;
}

export interface OutcomeSelectOption extends SelectOption {
  value: number;
}

export const isAsset = (val: any): val is Asset => {
  return val.type === "Asset";
};

export const zulAsset = { zul: null };
export const zulAssetJson = JSON.stringify(zulAsset);

export const isAssetZUL = (val: any): val is { zul: null } => {
  return JSON.stringify(val) === zulAssetJson;
};

export type Primitive = null | number | string | boolean;
export type JSONObject =
  | Primitive
  | { [key: string]: JSONObject }
  | JSONObject[];

export interface MarketOutcome {
  metadata: JSONObject;
  asset: AssetId | null;
  weight: number | null;
}

export interface EndpointOption {
  value: string;
  label: string;
  parachain: SupportedParachain;
}

export const isCustomEndpointOption = (
  val: EndpointOption,
): val is EndpointOption => {
  return val.parachain == SupportedParachain.CUSTOM;
};

export type TradeType = "buy" | "sell";
