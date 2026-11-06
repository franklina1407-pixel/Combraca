const V='gestor-v1.2',A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='dados').map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
self.addEventListener('periodicsync',e=>{if(e.tag==='avisos')e.waitUntil(av())});
async function av(){const c=await caches.open('dados'),r=await c.match('dados.json');if(!r)return;const d=await r.json(),n=new Date(),p=x=>String(x).padStart(2,'0'),hj=n.getFullYear()+'-'+p(n.getMonth()+1)+'-'+p(n.getDate());
if(d.a===hj||n.toTimeString().slice(0,5)<d.h)return;const df=v=>Math.round((new Date(hj+'T12:00')-new Date(v+'T12:00'))/864e5),h=d.c.filter(x=>df(x.v)===0),a=d.c.filter(x=>df(x.v)>=d.d);if(!h.length&&!a.length)return;
d.a=hj;await c.put('dados.json',new Response(JSON.stringify(d)));
await self.registration.showNotification('💜 Cobranças de hoje',{body:(h.length?h.length+' vence(m) hoje: '+h.slice(0,4).map(x=>x.n).join(', ')+'. ':'')+(a.length?a.length+' atrasado(s).':''),icon:'icon-192.png',tag:'hoje'})}
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('./'))});
