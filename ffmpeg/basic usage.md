# [FFMPEG](https://ffmpeg.org/)

### Installation:



### Basic usage:

```sh
# Finding out how many FPS your video has
ffmpeg -i output.mp4 2>&1 | egrep -o '[0-9]+ fps'


# Optimizing your video
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 output.mp4


# Resizing video resolution
ffmpeg -i input.mp4 -vf scale=1280:720 -preset slow -crf 18 output.mp4


# Resizing the width and height will be proportional
ffmpeg -i input.mp4 -vf scale=1280:-1 output.mp4

# Removing audio from a video
ffmpeg -i input.mp4 -c copy -an output.mp4

# Extracting frames from a video
mkdir frames
ffmpeg -y -ss 00:00 -i input.mp4 -t 10 "frames/filename%05d.jpg"


# current options
ffmpeg -i 123.mp4 -vf scale=1440:-1 -preset slow -crf 28 -x264-params keyint=1 -movflags empty_moov output.mp4

```
