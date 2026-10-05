import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
test('two learners collaborate with authenticated rooms and durable state',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'mindmate-test-'));const port=3147,base=`http://localhost:${port}`;
 let child;async function start(){child=spawn(process.execPath,['server.js'],{cwd:new URL('.',import.meta.url),env:{...process.env,PORT:String(port),HOST:'127.0.0.1',PUBLIC_ORIGIN:base,OPENAI_API_KEY:'',DATA_FILE:join(dir,'db.json')},stdio:['ignore','pipe','pipe']});await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',code=>reject(new Error('Server exited '+code)));});}
 async function stop(){if(child&&child.exitCode===null){const ended=once(child,'exit');child.kill();await ended;}}
 t.after(async()=>{await stop();await rm(dir,{recursive:true,force:true});});await start();
 async function request(path,body,cookie){const r=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
 const a=await request('/api/session',{}),b=await request('/api/session',{}),c=await request('/api/session',{});assert.ok(a.cookie.includes('mm_session='));
 const profile={name:'Learner A',subject:'Math',topic:'Algebra',course:'Year 1',goal:'Exam',level:'Beginner',preference:'Online',timezone:'UTC',start:'19:00',end:'21:00',days:['Mon'],discoverable:true};
 assert.equal((await request('/api/profile',profile,a.cookie)).status,200);await request('/api/profile',{...profile,name:'Learner B'},b.cookie);
 const matches=await request('/api/buddies',undefined,a.cookie);assert.equal(matches.data.buddies.length,1);assert.equal(matches.data.buddies[0].score,100);
 const created=await request('/api/rooms',{name:'Test room',topic:'Algebra',goal:'Solve five problems',target:5},a.cookie);assert.equal(created.status,201);const rid=created.data.room.id,invite=new URL(created.data.link).hash.slice(8),path='/api/rooms/'+rid;
 assert.equal((await request(path,undefined,b.cookie)).status,403);assert.equal((await request('/api/join',{room:rid,invite:'wrong'},b.cookie)).status,403);
 assert.equal((await request('/api/join',{room:rid,invite},b.cookie)).status,200);
 await request(path+'/message',{text:'Let’s study'},a.cookie);assert.equal((await request(path,undefined,b.cookie)).data.room.messages[0].text,'Let’s study');
 assert.equal((await request(path+'/notes',{notes:'First draft',version:0},a.cookie)).status,200);assert.equal((await request(path+'/notes',{notes:'Conflict',version:0},b.cookie)).status,409);
 assert.equal((await request(path+'/timer',{command:'start'},b.cookie)).status,403);await request(path+'/timer',{command:'start'},a.cookie);assert.equal((await request(path,undefined,b.cookie)).data.room.timer.running,true);
 const qr=await request(path+'/quiz',{topic:'algebra'},a.cookie);assert.equal(qr.data.room.quiz.correct,undefined);assert.equal(qr.data.room.scores,undefined);const qid=qr.data.room.quiz.id;
 assert.equal((await request(path+'/answer',{quiz:qid,answer:1},b.cookie)).status,200);assert.equal((await request(path+'/answer',{quiz:qid,answer:1},b.cookie)).status,409);assert.equal((await request(path,undefined,a.cookie)).data.room.leaderboard.length,0);
 const revealed=await request(path+'/reveal',{},a.cookie);assert.equal(revealed.data.room.quiz.correct,1);assert.equal(revealed.data.room.leaderboard[0].points,10);
 assert.equal((await request('/api/chat',{messages:[{role:'user',text:'Hi'}]},a.cookie)).status,503);
 const cors=await fetch(base+'/api/rooms',{method:'POST',headers:{Origin:'https://bad.example','Content-Type':'application/json',Cookie:a.cookie},body:'{}'});assert.equal(cors.status,403);
 const secret=await fetch(base+'/.env');assert.equal(secret.status,404);
 await stop();await start();assert.equal((await request(path,undefined,b.cookie)).data.room.notes,'First draft');
 await request('/api/delete',{},a.cookie);assert.equal((await request('/api/buddies',undefined,b.cookie)).data.buddies.length,0);assert.equal((await request(path,undefined,b.cookie)).data.room.messages.length,0);assert.equal((await request(path,undefined,c.cookie)).status,403);
});
