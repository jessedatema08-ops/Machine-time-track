const CACHE="machine-track-v5-history";
const FALLBACK="./index.html";

self.addEventListener("install",event=>event.waitUntil(self.skipWaiting()));
self.addEventListener("activate",event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())
));

function cleanHistory(html){
  html=html.replace('<th>Cumulative</th><th>Daily</th>','<th>Captured Data</th><th>Daily Total</th>');
  html=html.replace("m.type==='haas'?x.cumulative.cycle.toFixed(3)+' / Feed '+x.cumulative.feed.toFixed(3):x.cumulative.machine.toFixed(3)","m.type==='haas'?`<div style=\"text-align:left;white-space:nowrap\"><b>Cycle Time:</b> ${x.cumulative.cycle.toFixed(3)}</div><div style=\"text-align:left;white-space:nowrap\"><b>Feed Time:</b> ${x.cumulative.feed.toFixed(3)}</div>`:`<div style=\"text-align:left;white-space:nowrap\"><b>Machine Time:</b> ${x.cumulative.machine.toFixed(3)}</div>`");
  html=html.replace("m.type==='haas'?x.daily.cycle.toFixed(3)+' / '+x.daily.feed.toFixed(3):x.daily.machine.toFixed(3)","m.type==='haas'?`<div style=\"text-align:left;white-space:nowrap\"><b>Cycle:</b> ${x.daily.cycle.toFixed(3)} h</div><div style=\"text-align:left;white-space:nowrap\"><b>Feed:</b> ${x.daily.feed.toFixed(3)} h</div>`:`${x.daily.machine.toFixed(3)} h`");
  return html;
}

async function getPage(request){
  try{
    const response=await fetch(request,{cache:"no-store"});
    const type=response.headers.get("content-type")||"";
    if(!type.includes("text/html")) return response;
    const html=cleanHistory(await response.text());
    const headers=new Headers(response.headers);
    headers.set("content-type","text/html; charset=utf-8");
    const copy=new Response(html,{status:response.status,statusText:response.statusText,headers});
    caches.open(CACHE).then(cache=>cache.put(FALLBACK,copy.clone()));
    return copy;
  }catch(error){
    return (await caches.match(FALLBACK))||new Response("Offline",{status:503});
  }
}

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  if(event.request.mode==="navigate"){
    event.respondWith(getPage(event.request));
    return;
  }
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});