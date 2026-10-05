import test from 'node:test';
import assert from 'node:assert/strict';
import {lesson,respond} from './public/engine.js';
test('knowledge check precedes grading',()=>{const s=lesson();assert.equal(respond(s,'not sure').kind,'normal');assert.equal(s.attempts,0);});
test('hints escalate and do not award XP',()=>{const s=lesson();const a=respond(s,'','hint'),b=respond(s,'','hint');assert.notEqual(a.text,b.text);assert.equal(b.xp,undefined);});
test('solution guard and reveal prevent independent completion XP',()=>{const s=lesson();assert.equal(respond(s,'','solution').kind,'hint');respond(s,'','solution');respond(s,'not sure');assert.equal(respond(s,'x = 4').xp,0);});
test('wrong answer receives correction; intermediate step advances',()=>{const s=lesson();respond(s,'I know inverse operations');assert.equal(respond(s,'x = 24').kind,'hint');respond(s,'3x = 12');assert.equal(s.stage,2);assert.equal(respond(s,'x = 4').xp,40);assert.equal(respond(s,'x = 4').xp,undefined);});
test('all practice tiers have consistent answers',()=>{for(const topic of ['algebra','science','code'])for(let d=1;d<=3;d++){const s=lesson(topic,d);respond(s,'I will try');assert.equal(respond(s,String(s.answer)).kind,'success');}});
test('teach-back awards once and asks for missing explanation',()=>{const s=lesson();s.teach=true;assert.equal(respond(s,'4').kind,'hint');assert.equal(respond(s,'Subtract and divide both sides equally').xp,25);assert.equal(respond(s,'Subtract and divide both sides equally').xp,undefined);});
