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
        frameRate: Math.min(config.fps, 24), // Reduced to 24fps for better performance
        bitrateVideo: Math.min(config.bitrateKbps, 1200), // Significantly reduced bitrate
        bitrateVideoMax: Math.min(config.maxBitrateKbps, 1800), // Reduced max bitrate
        videoCodec: Utils.normalizeVideoCodec(config.videoCodec),
        hardwareAcceleratedDecoding: config.hardwareAcceleratedDecoding,
        minimizeLatency: true, // Enable latency minimization
        h26xPreset: 'ultrafast' as const, // Use ultrafast preset for maximum performance
        audioBitrate: 96, // Reduced audio bitrate
        audioChannels: 2, // Stereo audio
        audioSampleRate: 48000, // Standard sample rate
        keyframeInterval: 1, // Very frequent keyframes for better seeking
        bufferSize: 8192, // Much larger buffer for smoother playback
        maxMuxingQueueSize: 2048, // Increased muxing queue size
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
        '-analyzeduration 20M', // Increased analyze duration
        '-probesize 20M', // Increased probe size
        '-fflags +genpts+discardcorrupt', // Generate presentation timestamps and discard corrupt frames
        '-avoid_negative_ts make_zero', // Handle negative timestamps
        '-max_delay 100000', // Reduced maximum delay for audio/video sync
        '-thread_queue_size 512', // Increased thread queue size
    ];
    
    return `${inputOptions.join(' ')} -i "${input}"`;
}

/**
 * Get optimized FFmpeg output options
 */
export function getOptimizedFfmpegOutput(): string {
    return [
        // Video settings - ultra-aggressive optimization
        '-c:v libx264', // Use H.264 codec
        '-preset ultrafast', // Fastest encoding preset
        '-tune zerolatency', // Optimize for low latency
        '-profile:v baseline', // Use baseline profile for compatibility
        '-level 3.0', // Set H.264 level
        '-x264-params keyint=30:min-keyint=30:scenecut=0:bframes=0:ref=1', // Ultra-aggressive keyframe settings
        '-g 30', // Smaller GOP size
        '-bf 0', // No B-frames for lower latency
        '-refs 1', // Single reference frame
        '-crf 28', // Higher CRF for lower bitrate
        '-maxrate 1200k', // Maximum bitrate
        '-bufsize 2400k', // Buffer size
        
        // Audio settings - reduced quality for performance
        '-c:a aac', // Use AAC codec
        '-b:a 96k', // Reduced audio bitrate
        '-ar 48000', // Sample rate
        '-ac 2', // Stereo channels
        
        // Output settings - optimized for low latency
        '-f mpegts', // MPEG-TS format
        '-muxdelay 0.05', // Minimal muxing delay
        '-muxpreload 0.05', // Minimal preload
        '-flush_packets 1', // Flush packets immediately
        '-fflags +genpts', // Generate presentation timestamps
        '-avoid_negative_ts make_zero', // Handle negative timestamps
        '-max_muxing_queue_size 2048', // Increased muxing queue
        '-threads 2', // Limit threads to reduce CPU usage
    ].join(' ');
}

/**
 * Get optimized stream options for specific video types
 */
export function getStreamOptionsForVideo(videoPath: string) {
    const baseOptions = getOptimizedStreamOptions();
    
    // Detect video type and optimize accordingly
    if (videoPath.includes('youtube.com') || videoPath.includes('youtu.be')) {
        // YouTube videos - use very conservative settings
        return {
            ...baseOptions,
            frameRate: Math.min(baseOptions.frameRate, 20), // Very low frame rate for YouTube
            bitrateVideo: Math.min(baseOptions.bitrateVideo, 800), // Very low bitrate
            minimizeLatency: true,
        };
    } else if (videoPath.includes('twitch.tv')) {
        // Twitch streams - optimize for live content
        return {
            ...baseOptions,
            frameRate: Math.min(baseOptions.frameRate, 24),
            bitrateVideo: Math.min(baseOptions.bitrateVideo, 1000),
            minimizeLatency: true,
        };
    } else {
        // Local files - can use slightly higher quality
        return {
            ...baseOptions,
            frameRate: Math.min(baseOptions.frameRate, 24),
            bitrateVideo: Math.min(baseOptions.bitrateVideo, 1200),
            minimizeLatency: true, // Still enable for local files
        };
    }
}

/**
 * Get FFmpeg filter for better performance
 */
export function getPerformanceFilters(): string {
    return [
        // Video filters - optimized for performance
        'scale=1280:720:flags=fast_bilinear', // Fast scaling instead of lanczos
        'fps=fps=24', // Reduced frame rate
        'format=yuv420p', // Ensure compatible pixel format
        
        // Audio filters - optimized for performance
        'aresample=48000:async=1000', // Resample audio with async
        'aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo', // Audio format
    ].join(',');
}

/**
 * Get emergency ultra-low settings for severe stuttering
 */
export function getEmergencyStreamOptions() {
    return {
        width: 854, // Reduced resolution
        height: 480,
        frameRate: 15, // Very low frame rate
        bitrateVideo: 500, // Very low bitrate
        bitrateVideoMax: 800,
        videoCodec: Utils.normalizeVideoCodec(config.videoCodec),
        hardwareAcceleratedDecoding: config.hardwareAcceleratedDecoding,
        minimizeLatency: true,
        h26xPreset: 'ultrafast' as const,
        audioBitrate: 64, // Very low audio bitrate
        audioChannels: 1, // Mono audio
        audioSampleRate: 48000,
        keyframeInterval: 1,
        bufferSize: 16384, // Very large buffer
        maxMuxingQueueSize: 4096,
    };
} 