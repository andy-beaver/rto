import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get date parameter or use today
const dateParam = process.env.DATE_PARAM;
const recordDate = dateParam && dateParam.trim() !== '' 
  ? new Date(dateParam) 
  : new Date();

if (isNaN(recordDate.getTime())) {
  console.error(`Invalid date format: ${dateParam}`);
  process.exit(1);
}

const formattedDate = recordDate.toISOString().split('T')[0];
const notes = process.env.NOTES_PARAM || '';

console.log(`Recording onsite day for: ${formattedDate}`);

// Path to the data file
const dataFilePath = join(__dirname, 'src', 'data', 'onsiteData.json');

// Read the current data
const data = JSON.parse(readFileSync(dataFilePath, 'utf8'));

// Find the correct month
const monthIndex = recordDate.getMonth();
const currentMonth = data.months[monthIndex];

// Check if we're already at the required amount
if (currentMonth.badge_count >= currentMonth.req_onsite) {
  console.log(`Already reached required onsite days (${currentMonth.req_onsite}) for ${currentMonth.month}`);
} else {
  // Increment badge count
  currentMonth.badge_count += 1;
  
  // Update percentage complete
  currentMonth.perc_complete = 
    ((currentMonth.badge_count / currentMonth.req_onsite) * 100).toFixed(1) + '%';
  
  // Add to logs
  if (!currentMonth.logs) {
    currentMonth.logs = [];
  }
  
  currentMonth.logs.push({
    date: formattedDate,
    action: "Onsite day recorded",
    timestamp: new Date().toISOString(),
    notes: notes
  });
  
  console.log(`Updated badge count for ${currentMonth.month} to ${currentMonth.badge_count}/${currentMonth.req_onsite}`);
  
  // Write the updated data back to the file
  writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  console.log(`Data file updated successfully.`);
}
