// src/types.ts

export interface MonthData {
    month: string;
    workdays: number;
    off_days: number;
    req_onsite: number;
    badge_count: number;
    perc_complete: string;
    logs: Array<{
      date: string;
      action: string;
      timestamp: string;
    }>;
  }
  
  export interface OnsiteData {
    year: number;
    months: MonthData[];
  }