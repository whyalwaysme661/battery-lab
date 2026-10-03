import {readFileSync,writeFileSync,readdirSync,lstatSync,mkdtempSync,rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import os from 'node:os';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const args=process.argv.slice(2);
const value=key=>{const index=args.indexOf(key);return index<0?null:args[index+1];};
const owner=value('--owner'),userId=value('--user-id');
if(!owner||!userId||!/^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/.test(owner)||!/^\d+$/.test(userId))throw new Error('Usage: npm run prepare:opensource -- --owner GITHUB_LOGIN --user-id GITHUB_NUMERIC_ID [--message MESSAGE]');
const identityEmail=`${userId}+${owner}@users.noreply.github.com`;
const ref='refs/heads/github-main';
function run(command,arguments_,options={}){
 const result=spawnSync(command,arguments_,{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024,...options});
 if(result.error)throw result.error;
 if(result.status!==0)throw new Error(`${command} ${arguments_[0]} failed: ${result.stderr||result.stdout}`);
 return String(result.stdout??'').trim();
}
run(process.execPath,['tools/third-party-notices.mjs','--check'],{stdio:'inherit'});
run(process.execPath,['tools/verify.mjs'],{stdio:'inherit'});
const rootFiles=['.gitignore','README.md','LICENSE','THIRD_PARTY_NOTICES.md','package.json','DESIGN.md'];
const files=[...rootFiles];
function visit(relative){
 const directory=path.join(root,relative);
 for(const entry of readdirSync(directory,{withFileTypes:true})){
  const next=relative+'/'+entry.name;
  if(next==='tools/user-goal.txt')continue;
  if(entry.isSymbolicLink())throw new Error('Symlink excluded from public release: '+next);
  if(entry.isDirectory())visit(next);else if(entry.isFile())files.push(next);
 }
}
visit('dist');visit('tools');
const blocked=relative=>relative.startsWith('.openai/')||relative.startsWith('.sites-runtime/')||relative.startsWith('.tmp/')||relative==='AGENTS.md'||relative==='MEMORY.md'||relative==='PRODUCT.md'||relative==='tools/user-goal.txt'||/(?:^|\/)\.env(?:\.|$)/.test(relative)||/\.(?:blend1?|log|key|pem)$/i.test(relative);
const secrets=/(?:sk-(?:proj-)?[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{25,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/;
const machinePaths=/[A-Za-z]:[\\/](?:Users|Documents and Settings)[\\/]/i;
const privateMail=/[\w.+-]+@(?:gmail|outlook|hotmail|qq|163|126)\.com\b/i;
const payloads=[];let bytes=0;
for(const relative of [...new Set(files)].sort()){
 if(blocked(relative))throw new Error('Private file reached public allowlist: '+relative);
 const file=path.resolve(root,relative);
 if(!file.startsWith(root+path.sep)||lstatSync(file).isSymbolicLink())throw new Error('Unsafe public path: '+relative);
 const data=readFileSync(file);if(data.length>50*1024*1024)throw new Error('Large file needs explicit release handling: '+relative);
 const text=data.toString('utf8');
 if(secrets.test(text))throw new Error('Possible secret in public file: '+relative);
 if(machinePaths.test(text)||privateMail.test(text))throw new Error('Possible personal path/contact in public file: '+relative);
 bytes+=data.length;payloads.push({relative,data});
}
const existing=spawnSync('git',['rev-parse','--verify',ref],{cwd:root,encoding:'utf8'});
const parent=existing.status===0?existing.stdout.trim():null;
if(parent){
 const oldPaths=run('git',['ls-tree','-r','--name-only',parent]).split(/\r?\n/);
 if(oldPaths.some(blocked))throw new Error('Existing public branch contains local-only files; refusing to use its history.');
 const emails=run('git',['log','--format=%ae%n%ce',parent]).split(/\r?\n/);
 if(emails.some(email=>!email.endsWith('@users.noreply.github.com')))throw new Error('Existing public branch contains non-private commit identities.');
 const roots=run('git',['rev-list','--max-parents=0',parent]).split(/\r?\n/);
 for(const commit of roots)if(run('git',['ls-tree','-r','--name-only',commit]).split(/\r?\n/).some(blocked))throw new Error('Local history cannot become public history.');
}
const tempPrefix=path.join(os.tmpdir(),'battery-lab-public-index-');
const temp=mkdtempSync(tempPrefix);
const env={...process.env,GIT_INDEX_FILE:path.join(temp,'index'),GIT_AUTHOR_NAME:owner,GIT_AUTHOR_EMAIL:identityEmail,GIT_COMMITTER_NAME:owner,GIT_COMMITTER_EMAIL:identityEmail};
try{
 run('git',['read-tree','--empty'],{env});
 const entries=payloads.map(({relative,data})=>`100644 ${run('git',['hash-object','-w','--stdin'],{env,input:data})}\t${relative}\0`).join('');
 run('git',['update-index','-z','--index-info'],{env,input:entries});
 const tree=run('git',['write-tree'],{env});
 const unchanged=parent&&run('git',['rev-parse',parent+'^{tree}'])===tree;
 const commit=unchanged?parent:run('git',['commit-tree',tree,...(parent?['-p',parent]:[])],{env,input:(value('--message')??(parent?'Update Battery Lab open-source release':'Initial open-source release of Battery Lab'))+'\n'});
 if(!unchanged)run('git',['update-ref',ref,commit,...(parent?[parent]:[])]);
 const listed=run('git',['ls-tree','-r','--name-only',commit]).split(/\r?\n/);
 if(listed.length!==payloads.length||listed.some(blocked))throw new Error('Public tree verification failed.');
 const report={branch:'github-main',commit,tree,files:payloads.length,sizeMiB:Math.round(bytes/1024/1024*10)/10,firstRelease:!parent,unchanged:Boolean(unchanged),privateFilesIncluded:false,historyInheritedFromLocal:false,commitIdentity:'GitHub ID-based noreply',sourceBranch:run('git',['branch','--show-current'])};
 console.log(JSON.stringify(report,null,2));
}finally{
 const resolved=path.resolve(temp);
 if(path.dirname(resolved)!==path.resolve(os.tmpdir())||!path.basename(resolved).startsWith('battery-lab-public-index-'))throw new Error('Unexpected public-index cleanup target');
 rmSync(resolved,{recursive:true,force:true});
}
