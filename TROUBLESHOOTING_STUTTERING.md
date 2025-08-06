# Troubleshooting Stuttering Issues

## Overview
This guide helps resolve video stuttering issues in StreamBot. Stuttering can be caused by various factors including system performance, network conditions, and video encoding settings.

## Quick Fixes

### 1. Use Emergency Mode
If you're experiencing severe stuttering (frame timing warnings > 1000%), try emergency mode:
```
!quality emergency
```
This uses ultra-low settings:
- 854x480 resolution
- 15 FPS
- 500 kbps video bitrate
- 64 kbps audio bitrate
- Mono audio

### 2. Try Lower Quality Settings
```
!quality low    # 20 FPS, 800 kbps
!quality medium # 24 FPS, 1200 kbps
!quality high   # 24 FPS, 1500 kbps
```

## Common Causes

### 1. **System Performance Issues**
- **CPU overload**: Video encoding is CPU-intensive
- **Insufficient RAM**: Large video files need memory
- **Slow storage**: Reading from slow drives causes buffering

### 2. **Network Issues**
- **Bandwidth limitations**: High bitrate videos need good internet
- **Latency**: High ping affects real-time streaming
- **Packet loss**: Network instability causes frame drops

### 3. **Video Source Issues**
- **Variable frame rates**: YouTube videos often have inconsistent FPS
- **High bitrate sources**: Some videos are too high quality
- **Corrupted frames**: Damaged video files cause stuttering

### 4. **Discord Limitations**
- **Voice channel limits**: Discord has bandwidth restrictions
- **Server location**: Distance to Discord servers affects performance
- **Bot rate limits**: Too many requests can cause issues

## Performance Commands

### Quality Settings
```
!quality low      # Minimal stuttering, lower quality
!quality medium   # Balanced performance
!quality high     # Better quality, may stutter
!quality emergency # Ultra-low settings for severe issues
```

### Monitoring
```
!status           # Check current stream status
!position         # Show current playback position
```

## Optimized Settings by Video Type

### YouTube Videos
- **Frame Rate**: 20 FPS (reduced from 24)
- **Bitrate**: 800 kbps (very conservative)
- **Reason**: YouTube videos often have variable frame rates

### Twitch Streams
- **Frame Rate**: 24 FPS
- **Bitrate**: 1000 kbps
- **Reason**: Live content needs consistent performance

### Local Files
- **Frame Rate**: 24 FPS
- **Bitrate**: 1200 kbps
- **Reason**: Local files can handle slightly higher quality

## Technical Optimizations Applied

### FFmpeg Settings
- **Preset**: `ultrafast` (fastest encoding)
- **Tune**: `zerolatency` (minimize latency)
- **Profile**: `baseline` (maximum compatibility)
- **GOP Size**: 30 frames (smaller for better seeking)
- **B-frames**: Disabled (reduces latency)
- **Reference frames**: 1 (minimal memory usage)

### Buffering Settings
- **Buffer Size**: 8192 (increased for smoother playback)
- **Muxing Queue**: 2048 (larger queue for stability)
- **Thread Queue**: 512 (better thread management)

### Audio Optimizations
- **Bitrate**: 96 kbps (reduced for performance)
- **Sample Rate**: 48 kHz (standard)
- **Channels**: Stereo (emergency mode uses mono)

## System Requirements

### Minimum Requirements
- **CPU**: 4-core processor (2.0 GHz+)
- **RAM**: 4 GB available
- **Storage**: SSD recommended
- **Network**: 5 Mbps upload speed

### Recommended Requirements
- **CPU**: 6-core processor (3.0 GHz+)
- **RAM**: 8 GB available
- **Storage**: NVMe SSD
- **Network**: 10+ Mbps upload speed

## Troubleshooting Steps

### Step 1: Check System Resources
1. Monitor CPU usage during streaming
2. Check available RAM
3. Monitor network upload speed
4. Check disk I/O performance

### Step 2: Try Emergency Mode
```
!quality emergency
```
If this fixes the stuttering, your system needs lower settings.

### Step 3: Check Video Source
1. Try different videos to isolate the issue
2. Test with local files vs. online sources
3. Check if specific video types cause more stuttering

### Step 4: Network Diagnostics
1. Test upload speed: https://www.speedtest.net
2. Check ping to Discord servers
3. Try different network connections

### Step 5: System Optimization
1. Close unnecessary applications
2. Disable background processes
3. Update graphics drivers
4. Check for system updates

## Advanced Solutions

### 1. Hardware Acceleration
Enable hardware acceleration in your config:
```javascript
hardwareAcceleratedDecoding: true
```

### 2. Custom FFmpeg Filters
Add performance filters to reduce processing:
```javascript
// In streamOptimizer.ts
'fps=fps=20', // Force lower frame rate
'scale=1280:720:flags=fast_bilinear', // Fast scaling
```

### 3. Buffer Optimization
Increase buffer sizes for smoother playback:
```javascript
bufferSize: 16384, // Very large buffer
maxMuxingQueueSize: 4096, // Large queue
```

## Emergency Mode Details

When you use `!quality emergency`, the bot applies these ultra-conservative settings:

### Video Settings
- **Resolution**: 854x480 (reduced from 1280x720)
- **Frame Rate**: 15 FPS (very low)
- **Bitrate**: 500 kbps (very low)
- **Max Bitrate**: 800 kbps

### Audio Settings
- **Bitrate**: 64 kbps (very low)
- **Channels**: Mono (instead of stereo)
- **Sample Rate**: 48 kHz

### Performance Settings
- **Buffer Size**: 16384 (very large)
- **Muxing Queue**: 4096 (very large)
- **Threads**: Limited to 2 (reduces CPU usage)

## Monitoring Performance

### Console Warnings to Watch For
```
WARN stream:video:send Frame takes too long to send (>100% frametime)
WARN stream:audio:send Frame takes too long to send (>100% frametime)
```

### Acceptable Performance
- **Frame timing**: < 50% of expected frametime
- **Audio timing**: < 100% of expected frametime
- **No dropped frames**: Consistent frame delivery

### Poor Performance Indicators
- **Frame timing**: > 200% of expected frametime
- **Audio timing**: > 500% of expected frametime
- **Frequent warnings**: Multiple warnings per second

## Getting Help

If stuttering persists after trying all solutions:

1. **Check the logs** for specific error messages
2. **Try emergency mode** to see if it's a performance issue
3. **Test with different videos** to isolate the problem
4. **Monitor system resources** during streaming
5. **Check network stability** and upload speeds

## Recent Optimizations

### Version 2.0 Changes
- **Reduced default frame rates** from 30 to 24 FPS
- **Lowered bitrates** across all quality levels
- **Added emergency mode** for severe stuttering
- **Improved buffering** with larger buffer sizes
- **Optimized FFmpeg settings** for better performance
- **Enhanced error handling** for corrupt frames

These changes should significantly reduce stuttering issues while maintaining acceptable video quality. 