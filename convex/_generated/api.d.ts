/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as companions from "../companions.js";
import type * as inventory from "../inventory.js";
import type * as items from "../items.js";
import type * as journal from "../journal.js";
import type * as messages from "../messages.js";
import type * as searchHistory from "../searchHistory.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  companions: typeof companions;
  inventory: typeof inventory;
  items: typeof items;
  journal: typeof journal;
  messages: typeof messages;
  searchHistory: typeof searchHistory;
  seed: typeof seed;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
