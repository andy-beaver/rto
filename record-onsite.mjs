import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Wack attempt at a gas price API function (fallback if not provided)
async function fetchGasPrice() {
  // This would normally connect to a real gas price API
  // For demo, we'll use a randomized realistic price or the provided value
  const providedPrice = process.env.GAS_PRICE;
  if (providedPrice && !isNaN(parseFloat(providedPrice))) {
    return parseFloat(providedPrice);
  }
  
  // Simulate API call with realistic gas prices for Kansas City
  // In the future I mightreplace with actual API call to gas price service
  return new Promise((resolve) => {
    // Randomize around the $2.50-$3.00 range for Missouri
    const basePrice = 2.75;
    const variation = 0.25;
    const randomPrice = (basePrice + (Math.random() * variation * 2 - variation)).toFixed(2);
    console.log(`Using simulated gas price: $${randomPrice}/gallon`);
    resolve(parseFloat(randomPrice));
  });
}

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

// Path to the data files
const dataFilePath = join(__dirname, 'src', 'data', 'onsiteData.json');
const commuteFilePath = join(__dirname, 'src', 'data', 'commuteData.json');

// Read the current data from said files
const onsiteData = JSON.parse(readFileSync(dataFilePath, 'utf8'));
let commuteData = {};

try {
  commuteData = JSON.parse(readFileSync(commuteFilePath, 'utf8'));
} catch (err) {
  console.log('Creating new commute data file');
  commuteData = { 
    "commuteLogs": [],
    "gasHistory": []
  };
}

// Find the correct month
const monthIndex = recordDate.getMonth();
const currentMonth = onsiteData.months[monthIndex];

// Fetch gas price (or use my static logic)
const gasPrice = await fetchGasPrice();

// Record gas price history
commuteData.gasHistory = commuteData.gasHistory || [];
commuteData.gasHistory.push({
  date: formattedDate,
  pricePerGallon: gasPrice
});

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
  
  // Record in onsite logs
  currentMonth.logs.push({
    date: formattedDate,
    action: "Onsite day recorded",
    timestamp: new Date().toISOString(),
    notes: notes,
    gasPrice: gasPrice
  });
  
  // Add to commute logs
  commuteData.commuteLogs = commuteData.commuteLogs || [];
  commuteData.commuteLogs.push({
    date: formattedDate,
    gasPrice: gasPrice
  });
  
  console.log(`Updated badge count for ${currentMonth.month} to ${currentMonth.badge_count}/${currentMonth.req_onsite}`);
  console.log(`Recorded gas price: $${gasPrice}/gallon`);
  
  // Write the updated data back to the files
  writeFileSync(dataFilePath, JSON.stringify(onsiteData, null, 2));
  writeFileSync(commuteFilePath, JSON.stringify(commuteData, null, 2));
  console.log(`Data files updated successfully.`);
}
