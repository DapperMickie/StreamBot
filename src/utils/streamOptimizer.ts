import config from "../config.js";
import { Utils } from "@dank074/discord-video-stream";
import logger from "./logger.js";

/**
 * Optimized streaming options to reduce stuttering
 */
export function getOptimizedStreamOptions() {
    return {
        width: config.width,
        height: config.height,
        frameRate: Math.min(config.fps, 30), // Cap at 30fps for stability
        bitrateVideo: Math.min(config.bitrateKbps, 2000), // Cap bitrate to reduce stuttering
        bitrateVideoMax: Math.min(config.maxBitrateKbps, 3000), // Cap max bitrate
        videoCodec: Utils.normalizeVideoCodec(config.videoCodec),
        hardwareAcceleratedDecoding: config.hardwareAcceleratedDecoding,
        minimizeLatency: true, // Enable latency minimization
        h26xPreset: 'veryfast', // Use veryfast preset for better performance
        audioBitrate: 128, // Optimize audio bitrate
        audioChannels: 2, // Stereo audio
        audioSampleRate: 48000, // Standard sample rate
        keyframeInterval: 2, // More frequent keyframes for better seeking
        bufferSize: 4096, // Larger buffer for smoother playback
        maxMuxingQueueSize: 1024, // Increase muxing queue size
    };
}

/**
 * Get optimized FFmpeg input options for different video sources
 */
export function getOptimizedFfmpegInput(videoSource: string, seekTime: number = 0): string {
    let input = videoSource;
    
    // Add seeking if needed
    if (seekTime > 0) {
        input = `${input} -ss ${seekTime}`;
    }
    
    // Add input options for better performance
    const inputOptions = [
        '-re', // Read input at native frame rate
        '-stream_loop -1', // Loop for live streams if needed
        '-analyzeduration 10M', // Increase analyze duration
        '-probesize 10M', // Increase probe size
        '-fflags +genpts', // Generate presentation timestamps
        '-avoid_negative_ts make_zero', // Handle negative timestamps
        '-max_delay 500000', // Maximum delay for audio/video sync
    ];
    
    return `${inputOptions.join(' ')} -i "${input}"`;
}

/**
 * Get optimized FFmpeg output options
 */
export function getOptimizedFfmpegOutput(): string {
    return [
        // Video settings
        '-c:v libx264', // Use H.264 codec
        '-preset veryfast', // Fast encoding preset
        '-tune zerolatency', // Optimize for low latency
        '-profile:v baseline', // Use baseline profile for compatibility
        '-level 3.0', // Set H.264 level
        '-x264-params keyint=60:min-keyint=60:scenecut=0', // Keyframe settings
        '-g 60', // GOP size
        '-bf 0', // No B-frames for lower latency
        '-refs 1', // Single reference frame
        
        // Audio settings
        '-c:a aac', // Use AAC codec
        '-b:a 128k', // Audio bitrate
        '-ar 48000', // Sample rate
        '-ac 2', // Stereo channels
        
        // Output settings
        '-f mpegts', // MPEG-TS format
        '-muxdelay 0.1', // Minimal muxing delay
        '-muxpreload 0.1', // Minimal preload
        '-flush_packets 1', // Flush packets immediately
        '-fflags +genpts', // Generate presentation timestamps
        '-avoid_negative_ts make_zero', // Handle negative timestamps
        '-max_muxing_queue_size 1024', // Increase muxing queue
    ].join(' ');
}

/**
 * Get optimized stream options for specific video types
 */
export function getStreamOptionsForVideo(videoPath: string) {
    const baseOptions = getOptimizedStreamOptions();
    
    // Detect video type and optimize accordingly
    if (videoPath.includes('youtube.com') || videoPath.includes('youtu.be')) {
        // YouTube videos - use more conservative settings
        return {
            ...baseOptions,
            frameRate: Math.min(baseOptions.frameRate, 24), // Lower frame rate for YouTube
            bitrateVideo: Math.min(baseOptions.bitrateVideo, 1500), // Lower bitrate
            minimizeLatency: true,
        };
    } else if (videoPath.includes('twitch.tv')) {
        // Twitch streams - optimize for live content
        return {
            ...baseOptions,
            frameRate: Math.min(baseOptions.frameRate, 30),
            bitrateVideo: Math.min(baseOptions.bitrateVideo, 1800),
            minimizeLatency: true,
        };
    } else {
        // Local files - can use higher quality
        return {
            ...baseOptions,
            frameRate: Math.min(baseOptions.frameRate, 30),
            bitrateVideo: Math.min(baseOptions.bitrateVideo, 2000),
            minimizeLatency: false, // Less critical for local files
        };
    }
}

/**
 * Get FFmpeg filter for better performance
 */
export function getPerformanceFilters(): string {
    return [
        // Video filters
        'scale=1280:720:flags=lanczos', // High-quality scaling
        'fps=fps=30', // Ensure consistent frame rate
        'format=yuv420p', // Ensure compatible pixel format
        
        // Audio filters
        'aresample=48000', // Resample audio to 48kHz
        'aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo', // Audio format
    ].join(',');
} 