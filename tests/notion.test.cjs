const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'charlie-notion-tests-'));
for (const name of ['model', 'client', 'content', 'portfolio']) {
  const source = fs.readFileSync(path.join(__dirname, '..', 'lib', 'notion', `${name}.ts`), 'utf8');
  fs.writeFileSync(path.join(temporary, `${name}.js`), ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText);
}
process.on('exit', () => fs.rmSync(temporary, {recursive:true,force:true}));
const model = require(path.join(temporary,'model.js'));
const client = require(path.join(temporary,'client.js'));
const content = require(path.join(temporary,'content.js'));
const portfolio = require(path.join(temporary,'portfolio.js'));
const originalFetch = global.fetch;
const originalKey = process.env.NOTION_API_KEY;
process.on('exit',()=>{global.fetch=originalFetch; if(originalKey===undefined)delete process.env.NOTION_API_KEY;else process.env.NOTION_API_KEY=originalKey;});
const json = data => new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
const id = '11111111-1111-1111-1111-111111111111';
const page = (overrides={}) => ({id,parent:{data_source_id:client.sourceId('projects')},properties:{Published:{checkbox:true},'제목':{title:[{plain_text:'Actual project'}]}},...overrides});

test('publication is opt-in; archived, trashed and draft content is excluded',()=>{
 assert.equal(model.isPublic(page(),'projects'),true);
 for(const item of [page({archived:true}),page({in_trash:true}),page({properties:{}}),page({properties:{Published:{checkbox:false}}})])assert.equal(model.isPublic(item,'projects'),false);
 assert.equal(model.isPublic(page({properties:{Status:{select:{name:'Published'}}}}),'notes'),true);
 assert.equal(model.isPublic(page({properties:{Status:{select:{name:'In progress'}}}}),'notes'),false);
});
test('URLs normalize valid bare domains and reject unsafe or non-URL values',()=>{
 assert.equal(model.safeUrl('tanyak20.netlify.app'),'https://tanyak20.netlify.app/');
 for(const value of ['javascript:alert(1)','data:text/html,hello','Competition ran confidential','//evil.example','https://user:pass@example.com'])assert.equal(model.safeUrl(value),'');
});
test('project mapping preserves Notion text and never uses old local achievements',()=>{
 const mapped=portfolio.mapProject(page({properties:{'제목':{title:[{plain_text:'New project'}]},'Short Description':{rich_text:[{plain_text:'Original description'}]},Website:{url:'demo.example.com'},GitHub:{url:'Confidential'},Skills:{multi_select:[{name:'Python'}]}},cover:{file:{url:'https://files.example.com/temporary'}}}));
 assert.equal(mapped.title,'New project');assert.equal(mapped.impact,'Original description');assert.equal(mapped.problem,'');assert.equal(mapped.links.github,'');assert.equal(mapped.links.demo,'https://demo.example.com/');assert.match(mapped.images[0].src,/^\/api\/notion\/projects\//);
});
test('pagination follows cursor and sends the publication filter; repeated reads are cached',async()=>{
 process.env.NOTION_API_KEY='pagination-fixture';let calls=0;
 global.fetch=async(url,options)=>{calls++;const body=JSON.parse(options.body);assert.deepEqual(body.filter,{property:'Published',checkbox:{equals:true}});assert.equal(options.headers.Authorization,'Bearer pagination-fixture');if(calls===1)return json({results:[page()],has_more:true,next_cursor:'cursor-two'});assert.equal(body.start_cursor,'cursor-two');return json({results:[page({id:'22222222-2222-2222-2222-222222222222'})],has_more:false,next_cursor:null});};
 assert.equal((await client.queryPages('projects')).length,2);await client.queryPages('projects');assert.equal(calls,2);
});
test('pagination never silently accepts a missing next cursor',async()=>{
 process.env.NOTION_API_KEY='broken-pagination-fixture';global.fetch=async()=>json({results:[],has_more:true,next_cursor:null});
 await assert.rejects(client.queryPages('projects'),/Incomplete/);
});
test('block pagination preserves nested toggles and excludes sprint databases and child pages',async()=>{
 process.env.NOTION_API_KEY='blocks-fixture';const seen=[];
 global.fetch=async url=>{seen.push(url);if(url.includes('/toggle-id/'))return json({results:[{id:'nested',type:'paragraph',paragraph:{rich_text:[{plain_text:'Maintenance details'}]}}],has_more:false});if(url.includes('start_cursor'))return json({results:[{id:'last',type:'code',code:{rich_text:[{plain_text:'SELECT 1;'}],language:'sql'}}],has_more:false});return json({results:[{id:'toggle-id',type:'toggle',has_children:true,toggle:{rich_text:[{plain_text:'Maintenance'}]}},{id:'private-sprint',type:'child_database',has_children:true},{id:'private-page',type:'child_page',has_children:true}],has_more:true,next_cursor:'second'});};
 const blocks=await content.readBlocks(id);assert.equal(blocks.length,2);assert.equal(model.plain(blocks[0].children[0].text),'Maintenance details');assert.equal(blocks[1].type,'code');assert.equal(seen.length,3);assert.equal(seen.some(url=>url.includes('private')),false);
});
test('cached body is rejected immediately when publication is revoked',async()=>{
 process.env.NOTION_API_KEY='revoke-fixture';let published=true;let bodies=0;
 global.fetch=async url=>url.includes('/pages/')?json(page({properties:{Published:{checkbox:published}}})):(bodies++,json({results:[],has_more:false}));
 await content.publicContent('projects',id);published=false;await assert.rejects(content.publicContent('projects',id),e=>e.status===404);assert.equal(bodies,1);
});
test('direct requests reject foreign-source and malformed IDs before reading blocks',async()=>{
 process.env.NOTION_API_KEY='foreign-fixture';let calls=0;
 global.fetch=async()=>{calls++;return json(page({parent:{data_source_id:'other-source'}}));};
 await assert.rejects(content.publicContent('projects',id),e=>e.status===404);assert.equal(calls,1);
 await assert.rejects(content.publicContent('projects','../../private'),e=>e.status===404);assert.equal(calls,1);
});
test('missing server credentials fail explicitly without fallback records',async()=>{
 delete process.env.NOTION_API_KEY;await assert.rejects(client.notion('pages/'+id),e=>e.status===503);
});
test('cache deduplicates concurrent reads and expires without serving failed refreshes',async()=>{
 let calls=0;const loader=async()=>{calls++;return 'content';};
 await Promise.all([client.cached('dedupe-test',loader),client.cached('dedupe-test',loader)]);assert.equal(calls,1);
 await client.cached('expiry-test',loader,-1);await assert.rejects(client.cached('expiry-test',async()=>{throw new Error('refresh failed');}),/refresh failed/);
});
test('rate-limited responses are retried',async()=>{
 process.env.NOTION_API_KEY='rate-fixture';let calls=0;global.fetch=async()=>++calls===1?new Response('',{status:429,headers:{'Retry-After':'0'}}):json({ok:true});
 assert.deepEqual(await client.notion('pages/'+id),{ok:true});assert.equal(calls,2);
});
