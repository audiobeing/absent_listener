

////https://stackoverflow.com/questions/40233300/how-to-change-mp3-file-to-wav-file-in-node-js
// const max = require('max-api')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fffmpeg = require('fluent-ffmpeg');
fffmpeg.setFfmpegPath(ffmpegPath);
// const ffmpeg = require("ffmpeg")
let track = './trashremoval_132.wav';//your path to source file
console.log("started")
fffmpeg(track)
.toFormat('mp3')
.on('error', (err) => {
    console.log('An error occurred: ' + err.message);
})
.on('progress', (progress) => {
    // console.log(JSON.stringify(progress));
    console.log('Processing: ' + progress.targetSize + ' KB converted');
})
.on('end', () => {
    console.log('Processing finished !');
})
.save('./trash-test.mp3');//path where you want to save your file