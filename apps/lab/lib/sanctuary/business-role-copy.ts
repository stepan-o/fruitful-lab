import type { CircuitParty } from "./business-circuit";

type RoleCopy = Pick<CircuitParty, "role" | "pays" | "earns" | "next">;

// Shared responsibilities use identical language. Override only a real change
// in the selected arrangement, such as catalog revenue or integrated ownership.
export const studioCopy: RoleCopy = {
  role: "Develops the game",
  pays: "The people, tools and production work needed to build and support the game.",
  earns: "Development funding from the publisher within the same company group.",
  next: "Funding to support existing games and make the next release.",
};

export const publisherCopy: RoleCopy = {
  role: "Funds & publishes",
  pays: "Development, licensing, marketing, release and support.",
  earns: "Game sales, after distribution costs and other obligations.",
  next: "Enough revenue to support existing games and fund the next release.",
};
export const catalogPublisherCopy: RoleCopy = {
  ...publisherCopy,
  earns: "Game sales and licensing payments from catalog operators.",
};

export const storefrontCopy: RoleCopy = {
  role: "Sells & delivers",
  pays: "Store discovery, checkout, downloads and customer support.",
  earns: "Its agreed share of game sales.",
  next: "Another game purchase. Players need to find something worth buying.",
};
export const integratedStorefrontCopy: RoleCopy = {
  ...storefrontCopy,
  earns: "Game sales within the same company group as the publisher.",
};
export const catalogCopy: RoleCopy = {
  role: "Supplies catalog access",
  pays: "Catalog content, discovery, downloads and service operation.",
  earns: "Recurring catalog membership fees.",
  next: "Another membership period. Players need reasons to keep access to the catalog.",
};

export const hardwareRetailerCopy: RoleCopy = {
  role: "Sells equipment",
  pays: "Stock, premises, staff and customer support.",
  earns: "Hardware and accessory sales.",
  next: "Another equipment purchase. Replaying a game can use hardware already owned.",
};
export const cloudProviderCopy: RoleCopy = {
  role: "Runs & streams",
  pays: "Remote computing capacity, power, networking and service operation.",
  earns: "Cloud membership fees, separate from payment for game access.",
  next: "Another membership period. Providing the remote computer has continuing costs.",
};

const player = {
  role: "Accesses & plays",
  next: "A game worth spending time with.",
};
export const localPlayerCopy: RoleCopy = {
  ...player,
  pays: "A game purchase and a hardware purchase. Optional extras are separate.",
  earns: "Use of the purchased game on their own hardware.",
};
export const catalogLocalPlayerCopy: RoleCopy = {
  ...player,
  pays: "A catalog membership and a hardware purchase. Optional extras are separate.",
  earns: "Use of included games on their own hardware while the catalog membership remains active and the games remain included.",
};
export const cloudPlayerCopy: RoleCopy = {
  ...player,
  pays: "A game purchase and a cloud membership, plus a receiving device and connection. Optional extras are separate.",
  earns: "Use of the purchased game on remote hardware while the cloud membership remains active and the game is supported.",
};
export const catalogCloudPlayerCopy: RoleCopy = {
  ...player,
  pays: "A catalog membership and a cloud membership, plus a receiving device and connection. Optional extras are separate.",
  earns: "Use of included games on remote hardware while both memberships remain active and the game is supported.",
};
