export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const defaultBlockedSites = [
  {
    id: '6969',
    url: 'https://example.com',
    blockedDays: [0, 1, 2, 3, 4, 5, 6], // Blocked every day for testing
  },
  {
    id: '9696',
    url: 'https://test.com',
    blockedDays: [0, 2, 4], // Blocked on Sunday, Tuesday, and Thursday for testing
  },
  {
    id: '151515',
    url: 'https://x.com',
    blockedDays: [1, 3, 5], // Blocked on Monday, Wednesday, and Friday for testing
  },
];

export const CHROME_STORAGE_KEY = 'unlimitedBlockSites';
