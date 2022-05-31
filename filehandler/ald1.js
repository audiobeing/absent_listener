const max = require('max-api'); /// require max api
const chokidar = require("chokidar"); /// file watch package

let config = require("./config.json"); //private ftp configuration file - DO NOT SAVE TO GITHUB
const watcher = chokidar.watch(config.folder, { persistent: true });
var filePath = null; 

const FTPClient = require('ftp'); /// ftp client package
let ftp_client = new FTPClient(); /// create the client
const fs = require("fs"); /// node file handling service

/// convert to MP3 using ffmpeg
// https://stackoverflow.com/questions/45555960/nodejs-fluent-ffmpeg-cannot-find-ffmpeg
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path; //max requires this to be installed
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

/// setup functions/etc called from max
var handlers = {
    "convert": convertToMP3, 
    "rec_filename": rec_filename
}
max.addHandlers(handlers)

/// some global variables
var date; 
var mp3filePath;
var mp3filePathSave; 
var mp3file; 


//create a connection to ftp server
    ftp_client.connect(config);
    ftp_client.on('ready', function() {
        logs(`Connected to ${config.user}`)
        
    });
    ftp_client.on('close', function(){
        logs('Disconnected from ftp client')
    })

// setup folder watcher 
watcher
  .on('add', (path) => {
      var test = path.split(".")
      test = test[test.length-1]; 
      if(test == "aiff" || test == "wav"){
        max.post("filePath = "+path)
        filePath = path; 
      }
      
    //   console.log(`File ${path} has been added`)
    //   max.outlet(`File ${path} has been added`)
      max.post(`File ${path} has been added`)
  })
  .on('change', (path)=>{
    // filePath = path; 
    if(path == filePath){
        max.post("file == filePath")
    }
    var test = path.split(".")
      test = test[test.length-1]; 
      logs(`FILE SAVED/CHANGED::: ${path}`)
      if(test == "aiff" || test == "wav"){
        logs("AIFF SAVED: call convert"); 
        convertToMP3()
      }
      if(test == "mp3"){
        max.post("MP3 SAVED: call upload to ftp"); 
        ftpUpload(); 
      }
  })
  .on('save', ()=>{
      console.log("save recognized")
  })



///////// FUNCTIONS

async function convert(){
    convertToMP3()
    .then(()=>{logs("CONVERTED")})
}
async function convertToMP3(){
    // max.post("convert called", filePath);
    date = new Date(); 
    date = date.getTime(); 
    mp3filePathSave = filePath.split('.');
    mp3filePath = `${mp3filePathSave[0]}_${date}.mp3`
    mp3filePathSave = `${mp3filePathSave[0]}_${date}.mp3`  /// error here with ./ - this mean current directory
    mp3file = mp3filePath.split("/"); 
    mp3file = mp3file[mp3file.length-1]
    // max.post("date", mp3filePath, mp3file);  
    // max.post("ffmpeg", filePath)
    ffmpeg(filePath)
        // .audioBitrate(320)
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

            // setTimeout(async ()=>{
            //     ftp_client.put(mp3filePath, mp3file, function(err) {
            //         if (err) throw err;
            //         ftp_client.end();
            //         logs("uploaded to ftp")
            //         });
            // }, 2000); 
            
        } )
        .save(mp3filePathSave); //path where you want to save your file

}
async function ftpUpload(){
    // let ftp_client = new FTPClient(); /// create the client
    // ftp_client.connect(ftpConfig);
    // ftp_client.on('ready', function() {
        logs(`uploading ${mp3filePath} as ${mp3file}`)
        ftp_client.put(mp3filePath, mp3file, function(err) {
            if (err) throw err;
            // ftp_clie nt.end();
            logs("uploaded to ftp")
        });
    // });
    // ftp_client.on('close', function(){
    //     logs('Disconnected from ftp client')
    // })  
    
}   
function rec_filename(name){
    logs(name)
}
function logs(mess){
    console.log(mess); 
    max.post(mess); 
}

