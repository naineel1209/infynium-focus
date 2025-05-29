interface BlockedSite {
  id: string;
  url: string;
  blockedDays: number[]; // Array of day indices when the site is blocked, e.g., [0, 1] for Sunday and Monday
}

interface UbsWrapper {
  blockedSites: BlockedSite[];
}

export type { BlockedSite, UbsWrapper };
