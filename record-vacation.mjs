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

console.log(`Recording vacation day for: ${formattedDate}`);

// Path to the data file
const dataFilePath = join(__dirname, 'src', 'data', 'onsiteData.json');

// Read the current data
const data = JSON.parse(readFileSync(dataFilePath, 'utf8'));

// Find the correct month
const monthIndex = recordDate.getMonth();
const currentMonth = data.months[monthIndex];

// Increment off days
currentMonth.off_days += 1;

// Record in logs
if (!currentMonth.logs) {
  currentMonth.logs = [];
}

currentMonth.logs.push({
  date: formattedDate,
  action: "Vacation day recorded",
  timestamp: new Date().toISOString(),
  notes: notes
});

console.log(`Updated off days for ${currentMonth.month} to ${currentMonth.off_days}`);

// Write the updated data back to the file
writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
console.log(`Data file updated successfully.`);
