export type TSendEmail = {
  sendTo: 'all' | string | string[]; // "all", a single email string, or an array of email strings
  subject: string; // Required subject string
  message: string; // Required message string
};
