import {readFileSync,writeFileSync,mkdirSync,renameSync} from 'node:fs';
import {dirname} from 'node:path';
import {randomBytes,createHash} from 'node:crypto';
export const id=()=>randomBytes(18).toString('base64url');
export const hash=s=>createHash('sha256').update(s).digest('hex');
export class Store{
 constructor(file){this.file=file;try{this.data=JSON.parse(readFileSync(file,'utf8'));if(!this.data.users||!this.data.rooms)throw new Error('Invalid store');}catch(e){if(e.code!=='ENOENT')throw e;this.data={users:{},rooms:{}};}}
 save(){mkdirSync(dirname(this.file),{recursive:true});writeFileSync(this.file+'.tmp',JSON.stringify(this.data),{mode:0o600});renameSync(this.file+'.tmp',this.file);}
 createUser(){const token=id()+id(),user={id:id(),tokenHash:hash(token),created:Date.now(),profile:null,events:[],invitations:[],rooms:[]};this.data.users[user.id]=user;this.save();return {user,token};}
 authenticate(token){if(!token)return null;const h=hash(token);return Object.values(this.data.users).find(u=>u.tokenHash===h)||null;}
}
