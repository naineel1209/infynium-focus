interface BlockedSite {
    id: string;
    url: string;
    blockedDays: Number[]; // Array of days when the site is blocked, e.g., ['Monday', 'Tuesday']
}

interface UbsWrapper {
    blockedSites: BlockedSite[];
}

export type {
    BlockedSite,
    UbsWrapper
}