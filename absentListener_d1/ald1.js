
const max = require('max-api')
/// file watch
const chokidar = require("chokidar"); 
/// DARREN _ HERE: ADD FILEPATH HERE// /Users/naisambpro/Music/AbsentListener_serveraudio/
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
var newFileName = ""; 
/// setup functions/etc called from max
var handlers = {
"convert": convert, 
"rec_filename": rec_filename
}
max.addHandlers(handlers)

var date; 

var mp3filePath;
var mp3filePathSave; 
var mp3file; 


let ftpConfig = {
    host: "ftp.audiobeing.com", /// FTP server
    port: 21, 
    user: 'audio@audiobeing.com', /// FTP Username
    password: 'ftptesting', /// Password (this is a simple test - only to be used on a local computer do not upload passwords to git or the web generally)
}
// let ftpConfig = {
//      host: "ftp.darrencopeland.net", /// FTP server
//      port: 21, 
//      user: 'AbsentListenerAuto@darrencopeland.net', /// FTP Username
//      password: 'IanTryOutDis!!', /// Password (this is a simple test - only to be used on a local computer do not upload passwords to git or the web generally)
// }
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

  function rec_filename(name){
    logs(name)
  }
  async function convert(){
      convertToMP3()
      .then(()=>{logs("CONVERTED")})
  }
  async function convertToMP3(){
    max.post("convert called", filePath);
    date = new Date(); 
            date = date.getTime(); 
            mp3filePathSave = filePath.split('.'); 
            mp3filePath = `${mp3filePathSave[0]}_${date}.mp3`
            mp3filePathSave = `./${mp3filePathSave[0]}_${date}.mp3` 
            mp3file = mp3filePath.split("/"); 
            mp3file = mp3file[mp3file.length-1]
            max.post("date", mp3filePath, mp3file);  
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
            // get current date --> UTC 
            
            // need filepath to absentlistener audio ******** 
            // convert to mp3 with same name (could delete -- later )
            // get the fileName from filePath and set below

            ftp_client.put(mp3filePath, mp3file, function(err) {
                if (err) throw err;
                ftp_client.end();
                logs("uploaded to ftp")
              });
        })
        .save(mp3filePathSave); //path where you want to save your file
        // .save(mp3filePath); //path where you want to save your file

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