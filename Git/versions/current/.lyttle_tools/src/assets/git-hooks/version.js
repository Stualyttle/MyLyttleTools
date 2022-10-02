// Import filesystem
const fs = require('fs');

// Get version in saved file
fs.readFile('./version.txt', 'utf8', (err, data) => {
  // If error, throw error
  if (err) throw new Error('Pre-commit hook failed');

  function updateVersion(newTxtVersion) {
    // Change version in saved file
    fs.writeFileSync('./version.txt', newTxtVersion);

    // Notify user
    console.log(
      'Updated from',
      '\x1b[31m' + data.split(':')[0],
      '\x1b[0m' + 'to',
      '\x1b[32m' + newTxtVersion.split(':')[0] + '\x1b[0m' + '!',
    );
  }

  // Split up version to update it.
  const version = data.split(':')[0];
  const v = version.split('.');

  // Desctructure version
  let [major, minor, patch, revision] = v;
  revision++;

  // Check version: Get day
  const today = new Date();

  // Get year
  const year = String(today.getFullYear()).slice(-2);

  // Create new date for week calculation.
  const tempToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  // Make Sunday's day number 7
  tempToday.setUTCDate(tempToday.getUTCDate() + 4 - (tempToday.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(tempToday.getUTCFullYear(), 0, 1));
  // Calculate full weeks to the nearest Sunday
  const week = String(Math.ceil((((tempToday - yearStart) / 86400000) + 1) / 7));
  // Return array of year and week number

  // Get day
  const days = [7, 1, 2, 3, 4, 5, 6];
  const day = String(days[today.getDay()]);

  if (year !== major || week !== minor || day !== patch) {
    // Setup version
    const ver = `${year}.${week}.${day}.1: `;
    updateVersion(ver);
    throw new Error('Invalid version, try again!');
  }


  // Update version
  const newVersion = `${major}.${minor}.${patch}.${revision}: `;
  updateVersion(newVersion);
});
