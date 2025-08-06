# Troubleshooting Stuttering Issues

## Common Causes of Stuttering

### 1. **High Bitrate/Frame Rate**
- **Problem**: Your system can't handle the current streaming settings
- **Solution**: Use the quality command to lower settings
  ```
  !quality low    # For minimal stuttering
  !quality medium # For balanced performance
  ```

### 2. **Network Issues**
- **Problem**: Slow or unstable internet connection
- **Solutions**:
  - Check your internet speed
  - Use wired connection instead of WiFi
  - Close other bandwidth-heavy applications
  - Try lower quality settings

### 3. **System Resources**
- **Problem**: CPU/GPU can't handle video processing
- **Solutions**:
  - Close other applications
  - Check CPU/GPU usage during streaming
  - Use hardware acceleration if available
  - Lower quality settings

### 4. **Video Source Issues**
- **Problem**: Some video sources are harder to process
- **Solutions**:
  - YouTube videos: Use `!quality low` or `!quality medium`
  - Twitch streams: Use `!quality medium`
  - Local files: Usually work best with `!quality high`

## Performance Commands

### Quality Settings
```
!quality low     # 24fps, 1000kbps - Minimal stuttering
!quality medium  # 30fps, 1500kbps - Balanced performance  
!quality high    # 30fps, 2000kbps - High quality (may stutter)
```

### Position Tracking
```
!position        # Check current playback position
!scrub <time>    # Jump to specific time
```

## Optimized Settings by Video Type

### YouTube Videos
- **Recommended**: `!quality low` or `!quality medium`
- **Reason**: YouTube videos often have variable frame rates
- **Settings**: 24fps, 1500kbps, latency minimization enabled

### Twitch Streams
- **Recommended**: `!quality medium`
- **Reason**: Optimized for live content
- **Settings**: 30fps, 1800kbps, latency minimization enabled

### Local Files
- **Recommended**: `!quality high`
- **Reason**: Local files can handle higher quality
- **Settings**: 30fps, 2000kbps, latency minimization disabled

## Technical Optimizations Applied

### FFmpeg Settings
- **Preset**: `veryfast` for better performance
- **Tune**: `zerolatency` for reduced latency
- **Profile**: `baseline` for compatibility
- **B-frames**: Disabled for lower latency
- **Reference frames**: Limited to 1

### Buffering
- **Buffer size**: Increased to 4096
- **Muxing queue**: Increased to 1024
- **Analyze duration**: Increased to 10M
- **Probe size**: Increased to 10M

### Latency Reduction
- **Minimize latency**: Enabled for online sources
- **Mux delay**: Reduced to 0.1s
- **Mux preload**: Reduced to 0.1s
- **Flush packets**: Enabled

## System Requirements

### Minimum Requirements
- **CPU**: 4 cores, 2.5GHz+
- **RAM**: 8GB+
- **Network**: 10Mbps+ upload
- **Storage**: SSD recommended

### Recommended Requirements
- **CPU**: 8 cores, 3.0GHz+
- **RAM**: 16GB+
- **Network**: 50Mbps+ upload
- **Storage**: NVMe SSD
- **GPU**: Hardware acceleration supported

## Troubleshooting Steps

### Step 1: Check Current Quality
```
!quality medium  # Start with medium quality
```

### Step 2: Monitor Performance
- Watch for stuttering patterns
- Check system resource usage
- Monitor network stability

### Step 3: Adjust Settings
```
!quality low     # If still stuttering
!quality high    # If system can handle more
```

### Step 4: Check Video Source
- Try different video sources
- Test with local files first
- Avoid very long videos initially

### Step 5: System Optimization
- Close unnecessary applications
- Use wired internet connection
- Ensure adequate cooling
- Check for background processes

## Advanced Troubleshooting

### Enable Debug Logging
Check the console output for:
- FFmpeg errors
- Network timeouts
- Resource usage warnings

### Network Diagnostics
- Test upload speed: https://www.speedtest.net
- Check for packet loss
- Verify Discord server location

### System Monitoring
- Monitor CPU usage during streaming
- Check memory usage
- Watch for thermal throttling

## Still Having Issues?

1. **Try different video sources** - Some videos are harder to process
2. **Use lower quality settings** - Start with `!quality low`
3. **Check your internet** - Upload speed is crucial
4. **Restart the bot** - Sometimes helps with resource issues
5. **Update dependencies** - Ensure latest versions of FFmpeg and other tools

## Performance Tips

- **Start with low quality** and work your way up
- **Use wired internet** instead of WiFi
- **Close other applications** during streaming
- **Monitor system resources** while streaming
- **Test with shorter videos** first
- **Use local files** for best performance 