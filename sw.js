const CACHE="machine-track-v4-ui";
const LOCAL=["./","./index.html","./v4-patch.js"];

self.addEventListener("install",e=>e.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting())
));

self.addEventListener("activate",e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
));

async function injectPatch(request){
  let response;
  try{ response=await fetch(request,{cache:"no-store"}); }
  catch(e){ response=await caches.match("./index.html"); }
  if(!response) return new Response("Offline",{status:503});
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html")) return response;
  let html=await response.text();
  if(!html.includes("v4-patch.js")) html=html.replace("</body>",'<script src="./v4-patch.js"></script></body>');
  const headers=new Headers(response.headers); headers.set("content-type","text/html; charset=utf-8");
  return new Response(html,{status:response.status,statusText:response.statusText,headers});
}

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const url=new URL(e.request.url);
  const isPage=e.request.mode==="navigate"||url.pathname.endsWith("/index.html")||url.pathname.endsWith("/Machine-time-track/");
  if(isPage){ e.respondWith(injectPatch(e.request)); return; }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
    const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r;
  })));
});
