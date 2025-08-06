import config from "../config.js";

/**
 * Performance configuration for streaming
 * Adjust these values based on your system capabilities and network conditions
 */
export const performanceConfig = {
    // Network and buffering settings
    bufferSize: 4096, // Larger buffer for smoother playback
    maxMuxingQueueSize: 1024, // Increase muxing queue size
    analyzeDuration: '10M', // Increase analyze duration
    probeSize: '10M', // Increase probe size
    
    // Latency settings
    maxDelay: 500000, // Maximum delay for audio/video sync (microseconds)
    muxDelay: 0.1, // Minimal muxing delay
    muxPreload: 0.1, // Minimal preload
    
    // Quality presets
    presets: {
        low: {
            frameRate: 24,
            bitrateVideo: 1000,
            minimizeLatency: true,
            description: 'Low quality, minimal stuttering'
        },
        medium: {
            frameRate: 30,
            bitrateVideo: 1500,
            minimizeLatency: true,
            description: 'Balanced quality and performance'
        },
        high: {
            frameRate: 30,
            bitrateVideo: 2000,
            minimizeLatency: false,
            description: 'High quality, may have some stuttering'
        }
    },
    
    // Video source specific settings
    sourceSettings: {
        youtube: {
            frameRate: 24,
            bitrateVideo: 1500,
            minimizeLatency: true,
            reason: 'YouTube videos often have variable frame rates'
        },
        twitch: {
            frameRate: 30,
            bitrateVideo: 1800,
            minimizeLatency: true,
            reason: 'Twitch streams are optimized for live content'
        },
        local: {
            frameRate: 30,
            bitrateVideo: 2000,
            minimizeLatency: false,
            reason: 'Local files can handle higher quality'
        }
    }
};

/**
 * Get performance settings for a specific video source
 */
export function getPerformanceSettings(videoSource: string) {
    if (videoSource.includes('youtube.com') || videoSource.includes('youtu.be')) {
        return performanceConfig.sourceSettings.youtube;
    } else if (videoSource.includes('twitch.tv')) {
        return performanceConfig.sourceSettings.twitch;
    } else {
        return performanceConfig.sourceSettings.local;
    }
}

/**
 * Get quality preset settings
 */
export function getQualityPreset(quality: 'low' | 'medium' | 'high') {
    return performanceConfig.presets[quality];
}

/**
 * Get FFmpeg input options for better performance
 */
export function getFfmpegInputOptions(): string[] {
    return [
        '-re', // Read input at native frame rate
        '-analyzeduration', performanceConfig.analyzeDuration,
        '-probesize', performanceConfig.probeSize,
        '-fflags', '+genpts', // Generate presentation timestamps
        '-avoid_negative_ts', 'make_zero', // Handle negative timestamps
        '-max_delay', performanceConfig.maxDelay.toString(),
    ];
}

/**
 * Get FFmpeg output options for better performance
 */
export function getFfmpegOutputOptions(): string[] {
    return [
        // Video settings
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-tune', 'zerolatency',
        '-profile:v', 'baseline',
        '-level', '3.0',
        '-x264-params', 'keyint=60:min-keyint=60:scenecut=0',
        '-g', '60',
        '-bf', '0', // No B-frames for lower latency
        '-refs', '1', // Single reference frame
        
        // Audio settings
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', '48000',
        '-ac', '2',
        
        // Output settings
        '-f', 'mpegts',
        '-muxdelay', performanceConfig.muxDelay.toString(),
        '-muxpreload', performanceConfig.muxPreload.toString(),
        '-flush_packets', '1',
        '-fflags', '+genpts',
        '-avoid_negative_ts', 'make_zero',
        '-max_muxing_queue_size', performanceConfig.maxMuxingQueueSize.toString(),
    ];
} 