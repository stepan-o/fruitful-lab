/* One-off export of the original Conveyor composition on the review runner. */
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const run = (cmd,args) => execFileSync(cmd,args,{stdio:'inherit'});
run('sudo',['apt-get','update','-qq']);
run('sudo',['apt-get','install','-y','-qq','ffmpeg','python3-numpy']);
run('/usr/bin/python3',['apps/lab/scripts/music/render_conveyor_layers.py','--masters','music-review/masters']);
const location='apps/lab/public/loopforge-design/music-audition/day-two/conveyor-line-02.mp3';
fs.copyFileSync(location,'music-review/conveyor-line-02.mp3');
console.log('LF_TRACK '+fs.readFileSync('music-review/masters/conveyor-track.json','utf8').replace(/\n/g,' '));
const blob=fs.readFileSync(location).toString('base64');
for(let i=0;i<blob.length;i+=12000) console.log('LF_AUDIO '+i+' '+blob.slice(i,i+12000));
