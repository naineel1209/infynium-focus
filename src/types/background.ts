interface MessageRequest {
  action: string;
  url?: string;
  timestamp?: number;
  currentUrl?: string;
  userAgent?: string;
  pageTitle?: string;
  timeSpent?: number;
  [key: string]: unknown;
}

interface MessageResponse {
  status?: string;
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

export type { MessageRequest, MessageResponse };
