// Simple test for time parsing functionality
import { parseTimeString, formatTimeString } from './src/utils/timeParser.js';

console.log('Testing time parsing...');

// Test cases
const testCases = [
    '1:30:45',  // 1 hour, 30 minutes, 45 seconds
    '2:30',     // 2 hours, 30 minutes
    '45',       // 45 seconds
    '0:30',     // 30 minutes
    '1:00',     // 1 hour
    '0:00:30'   // 30 seconds
];

testCases.forEach(timeStr => {
    try {
        const seconds = parseTimeString(timeStr);
        const formatted = formatTimeString(seconds);
        console.log(`${timeStr} -> ${seconds} seconds -> ${formatted}`);
    } catch (error) {
        console.error(`Error parsing ${timeStr}:`, error.message);
    }
});

console.log('\nTesting formatTimeString...');
const testSeconds = [0, 30, 90, 3600, 3661, 7325];
testSeconds.forEach(seconds => {
    console.log(`${seconds} seconds -> ${formatTimeString(seconds)}`);
}); 