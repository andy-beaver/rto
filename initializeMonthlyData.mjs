// initializeMonthlyData.mjs
// This script can be used to initialize or reset the monthly data
// It calculates required onsite days based on available workdays and a percentage

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const YEAR = 2025;
const ONSITE_PERCENTAGE = 0.5; // 50% requirement

// Helper function to get the number of workdays in a month (Mon-Fri)
function getWorkdaysInMonth(year, month) {
  let workdays = 0;
  const lastDay = new Date(year, month + 1, 0).getDate(); // Last day of month
  
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Count Monday through Friday as workdays
    if (dayOfWeek > 0 && dayOfWeek < 6) {
      workdays++;
    }
  }
  
  return workdays;
}

// Month names
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Initialize monthly data
const months = monthNames.map((month, index) => {
  const workdays = getWorkdaysInMonth(YEAR, index);
  const offDays = 0; // Start with no days off
  const availableWorkdays = workdays - offDays;
  const reqOnsite = Math.ceil(availableWorkdays * ONSITE_PERCENTAGE);
  
  return {
    month: month,
    workdays: workdays,
    off_days: offDays,
    req_onsite: reqOnsite,
    badge_count: 0,
    perc_complete: "0.0%",
    logs: []
  };
});

// Create the data object
const data = {
  year: YEAR,
  months: months
};

// Write to file
const dataFilePath = join(__dirname, 'src', 'data', 'onsiteData.json');
writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
console.log(`Initialized monthly data for ${YEAR} with ${ONSITE_PERCENTAGE * 100}% onsite requirement`);