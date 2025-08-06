/**
 * Parse time string in formats:
 * - "1:30:45" (hours:minutes:seconds)
 * - "2:30" (hours:minutes)
 * - "45" (seconds)
 * Returns time in seconds
 */
export function parseTimeString(timeString: string): number {
    const parts = timeString.split(':').map(Number);
    
    if (parts.length === 3) {
        // Format: hours:minutes:seconds
        const [hours, minutes, seconds] = parts;
        return (hours * 3600) + (minutes * 60) + seconds;
    } else if (parts.length === 2) {
        // Format: hours:minutes
        const [hours, minutes] = parts;
        return (hours * 3600) + (minutes * 60);
    } else if (parts.length === 1) {
        // Format: seconds
        return parts[0];
    }
    
    throw new Error('Invalid time format. Use HH:MM:SS, HH:MM, or SS');
}

/**
 * Convert seconds to HH:MM:SS format
 */
export function formatTimeString(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
} 