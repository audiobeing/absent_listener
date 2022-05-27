
const max = require('max-api')
/// file watch
const chokidar = require("chokidar"); 
const watcher = chokidar.watch('AbsentListener_serveraudio', { persistent: true });
var filePath = null; 
/// ftp client
const FTPClient = require('ftp');
/// create the client
let ftp_client = new FTPClient();
/// node file handling service
const fs = require("fs");

/// MP3 convert
// https://stackoverflow.com/questions/45555960/nodejs-fluent-ffmpeg-cannot-find-ffmpeg
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path; // the update for max requires this to be installed
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
let track = './trashremoval_132.wav'; // path to source file

/// setup functions/etc called from max
var handlers = {
"convert": convert
}
max.addHandlers(handlers)

let ftpConfig = {
    host: "ftp.audiobeing.com", /// FTP server
    port: 21, 
    user: 'audio@audiobeing.com', /// FTP Username
    password: 'ftptesting', /// Password (this is a simple test - only to be used on a local computer do not upload passwords to git or the web generally)
}
//create a connection to ftp server
ftp_client.connect(ftpConfig);
ftp_client.on('ready', function() {
    logs("connected to audiobeing.com")
    
  });

watcher
  .on('add', (path) => {
      filePath = path; 
      console.log(`File ${path} has been added`)
      max.outlet(`File ${path} has been added`)
      max.post(`File ${path} has been added`)
  })


  async function convert(){
    max.post("convert called", filePath); 
    ffmpeg(filePath)
        .toFormat('mp3')
        .on('error', (err) => {
            logs('An error occurred: ' + err.message);
        })
        .on('progress', (progress) => {
            // console.log(JSON.stringify(progress));
            logs('Processing: ' + progress.targetSize + ' KB converted');
        })
        .on('end', () => {
            logs('Processing finished !');
            ftp_client.put('AbsentListener_serveraudio/trash-test.mp3', 'MP3testSmall.mp3', function(err) {
                if (err) throw err;
                ftp_client.end();
                logs("uploaded to ftp")
              });
        })
        .save('./AbsentListener_serveraudio/trash-test.mp3'); //path where you want to save your file
  }

  function logs(mess){
      console.log(mess); 
      max.post(mess); 
  }




///////// TEST CODE




//   ffmpeg(track)
//         .toFormat('mp3')
//         .on('error', (err) => {
//             console.log('An error occurred: ' + err.message);
//         })
//         .on('progress', (progress) => {
//             // console.log(JSON.stringify(progress));
//             console.log('Processing: ' + progress.targetSize + ' KB converted');
//         })
//         .on('end', () => {
//             console.log('Processing finished !');
//         })
//         .save('./trash-test.mp3'); //path where you want to save your file