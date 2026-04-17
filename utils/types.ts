export interface Site {
  url: string;
  enabled: boolean;
}

export interface SiteGroup {
  groupName: string;
  sitesList: Site[];
  uid: string;
  groupEnabled: boolean;
  blockType: "website" | "word" | "regex";
}

export type LockType = "none" | "password" | "question" | "click-button";

export interface LockSettings {
  type: LockType;
  password: string;
  questionNumberOfTries: number;
  clickButtonCounts: number;
}

export interface WorkHours {
  startTime: string;
  endTime: string;
  days: string[];
  enableWorkHours: boolean;
}

export interface Settings {
  workHours: WorkHours;
  allowFunnyGoBackImages: boolean;
  lock: LockSettings;
}
