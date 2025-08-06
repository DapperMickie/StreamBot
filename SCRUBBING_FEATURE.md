# Scrubbing Feature for StreamBot

## Overview
The scrubbing feature allows you to jump to specific times in videos during playback. This is useful for skipping to interesting parts of videos or resuming from where you left off.

## Commands

### `scrub <time>`
Jump to a specific time in the currently playing video.

**Time Formats Supported:**
- `HH:MM:SS` - Hours:Minutes:Seconds (e.g., `1:30:45`)
- `HH:MM` - Hours:Minutes (e.g., `2:30`)
- `SS` - Seconds only (e.g., `45`)

**Examples:**
```
!scrub 1:30:45    # Jump to 1 hour, 30 minutes, 45 seconds
!scrub 2:30       # Jump to 2 hours, 30 minutes
!scrub 45         # Jump to 45 seconds
!scrub 0:30       # Jump to 30 minutes
```

### `position`
Show the current playback position of the video.

## How It Works

1. **Time Parsing**: The system parses your time input into seconds
2. **Stream Restart**: The current video stream is stopped and restarted from the new position
3. **FFmpeg Seeking**: For local video files, FFmpeg seeks directly to the specified time
4. **Position Tracking**: The system tracks the current seek position for future reference

## Limitations

- **Local Videos**: Full seeking support for local video files (.mp4, .mkv, .avi, .mov)
- **Online Videos**: Limited seeking support for YouTube/Twitch videos (may start from beginning)
- **Live Streams**: Seeking not supported for live content

## Technical Implementation

### Files Added/Modified:
- `src/utils/timeParser.ts` - Time parsing utilities
- `src/index.ts` - Main command handling and video playback logic

### Key Features:
- Flexible time format parsing
- Stream restart with seeking
- Position tracking
- Error handling for invalid time formats

## Usage Examples

```
# Start playing a video
!play my_video

# Jump to 5 minutes into the video
!scrub 5:00

# Check current position
!position

# Jump to 1 hour, 15 minutes, 30 seconds
!scrub 1:15:30
```

## Error Handling

The system will show helpful error messages for:
- Invalid time formats
- No video currently playing
- Seeking failures
- Unsupported video sources

## Future Enhancements

Potential improvements could include:
- Real-time position tracking during playback
- Bookmark system for saving positions
- Relative seeking (e.g., "+30" to jump forward 30 seconds)
- Seeking preview thumbnails 