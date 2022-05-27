/// node npm package ftp client
const FTPClient = require('ftp');
/// create the client
let ftp_client = new FTPClient();
/// node file handling service
const fs = require("fs");
/// (Hostpapa) site configuration 
/// information is in FTP Accounts on Hostpapa cpanel
// FTP Username: audio@audiobeing.com
// FTP server: ftp.audiobeing.com
// FTP & explicit FTPS port:  21
// let ftpConfig = {
//     host: "ftp.audiobeing.com", /// FTP server
//     port: 21, 
//     user: 'audio@audiobeing.com', /// FTP Username
//     password: 'ftptesting', /// Password (this is a simple test - only to be used on a local computer do not upload passwords to git or the web generally)
// }

// sftp://ftp.darrencopeland.net/home/darre187/www/TheAbsentListener/recordings
// server is ftp.darrencopeland.net
// port 22
// user is darre187
// password xghdyv79


/// SERVER: ftp.darrencopeland.net
// USER: AbsentListenerAuto@darrencopeland.net
/// PORT: 21
/// PASSWORD: IanTryOutDis!!


// let ftpConfig = {
//      host: "ftp.darrencopeland.net", /// FTP server
//      port: 21, 
//      user: 'AbsentListenerAuto@darrencopeland.net', /// FTP Username
//      password: 'IanTryOutDis!!', /// Password (this is a simple test - only to be used on a local computer do not upload passwords to git or the web generally)
// }


// let ftpConfig = {
//     host: "ftp.audiobeing.com", /// FTP server
//     port: 21, 
//     user: 'audi6519', /// FTP Username
//     password: 'Francis314', /// Password (this is a simple test - only to be used on a local computer do not upload passwords to git or the web generally)
// }
let ftpConfig = {
    host: "ftp.audiobeing.com", /// FTP server
    port: 21, 
    user: 'audio@audiobeing.com', /// FTP Username
    password: 'ftptesting', /// Password (this is a simple test - only to be used on a local computer do not upload passwords to git or the web generally)
}
//create a connection to ftp server
console.log("started")
ftp_client.connect(ftpConfig);
ftp_client.on('ready', function() {
    console.log("connected to audiobeing.com")
    ftp_client.put('3clip.mp3', 'MP3testSmall.mp3', function(err) {
        console.log("complete")
        if (err) throw err;
        ftp_client.end();
      });
  });