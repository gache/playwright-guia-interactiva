// Mock HTTPS server that stands in for the fictional hosts used by the exercises.
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';

const here = path.dirname(fileURLToPath(import.meta.url));
export const PORT = 8443;

// French exercises use *.exemple.com hosts; they behave exactly like the Spanish ones.
const ALIASES = {
  'mon-app.exemple.com': 'mi-app.ejemplo.com',
  'mon-app-graphql.exemple.com': 'mi-app-graphql.ejemplo.com',
  'mon-app-ws.exemple.com': 'mi-app-ws.ejemplo.com',
  'mon-tableau.exemple.com': 'mi-tabla.ejemplo.com',
  'ma-pwa.exemple.com': 'mi-pwa.ejemplo.com',
  'mon-site.exemple.com': 'mi-sitio.ejemplo.com',
};
export const HOSTS = [
  ...Object.keys(ALIASES), ...Object.values(ALIASES),
  'mi-tienda.ejemplo.com', 'ma-boutique.exemple.com',
];

function loadCert() {
  const dir = path.join(here, '.certs');
  const key = path.join(dir, 'key.pem'), cert = path.join(dir, 'cert.pem');
  if (!fs.existsSync(key)) {
    fs.mkdirSync(dir, { recursive: true });
    execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', cert, '-days', '30', '-subj', '/CN=localhost'], { stdio: 'ignore' });
  }
  return { key: fs.readFileSync(key), cert: fs.readFileSync(cert) };
}
const html = (body, head = '') => `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>App</title>${head}</head><body>${body}</body></html>`;
const send = (res, code, type, body, extra = {}) => { res.writeHead(code, { 'content-type': type, ...extra }); res.end(body); };
const json = (res, obj) => send(res, 200, 'application/json', JSON.stringify(obj));
let doc = '', jobStart = 0;

const products = [
  { id: 1, name: 'Caro', price: 30 }, { id: 2, name: 'Barato', price: 5 }, { id: 3, name: 'Medio', price: 12 },
];
const L = {
  'mi-tienda.ejemplo.com': { api: 'productos', sort: 'Ordenar por', add: 'Agregar', cart: 'Carrito', pay: 'Pagar', num: 'Número de tarjeta', date: 'Fecha', confirm: 'Confirmar pago', ok: 'Pago exitoso', conf: 'confirmacion', list: 'productos' },
  'ma-boutique.exemple.com': { api: 'produits', sort: 'Trier par', add: 'Ajouter', cart: 'Panier', pay: 'Payer', num: 'Numéro de carte', date: 'Date', confirm: 'Confirmer le paiement', ok: 'Paiement réussi', conf: 'confirmation', list: 'produits' },
};

function shop(host, url, res) {
  const t = L[host];
  if (url.startsWith('/api/' + t.api)) {
    const sort = new URL(url, 'https://x').searchParams.get('sort');
    const list = [...products]; if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    return json(res, list);
  }
  if (url.startsWith('/' + t.list)) {
    return send(res, 200, 'text/html', html(`<main><label>${t.sort} <select id="s"><option value="">-</option><option value="price-asc">Precio ↑</option></select></label>
      <div id="list"></div><p>cart: <span data-testid="cart-count">0</span></p><div data-testid="cart-summary"></div></main>
      <script>
      async function load(sort){ const r = await fetch('/api/${t.api}?sort='+(sort||'')); const items = await r.json();
        document.getElementById('list').innerHTML = items.map(p => '<article data-testid="product-card"><h3>'+p.name+'</h3><span data-testid="price">$'+p.price+'</span><button data-price="$'+p.price+'">${t.add}</button></article>').join(''); }
      load(); document.getElementById('s').onchange = e => load(e.target.value);
      document.getElementById('list').onclick = e => { if (e.target.tagName==='BUTTON'){ document.querySelector('[data-testid=cart-count]').textContent='1'; document.querySelector('[data-testid=cart-summary]').textContent='Total '+e.target.dataset.price; } };
      </script>`));
  }
  if (url === '/') {
    return send(res, 200, 'text/html', html(`<main><article data-testid="product-card"><h3>Prod</h3><button>${t.add}</button></article><a href="/cart">${t.cart}</a></main>`));
  }
  if (url === '/cart') return send(res, 200, 'text/html', html(`<main><button onclick="location.href='/checkout'">${t.pay}</button></main>`));
  if (url === '/checkout') {
    return send(res, 200, 'text/html', html(`<main><form id="f"><label>Email <input id="e"></label><label>${t.num} <input></label><label>${t.date} <input></label><label>CVC <input></label><button type="submit">${t.confirm}</button></form></main>
      <script>document.getElementById('f').onsubmit = async ev => { ev.preventDefault(); const email = document.getElementById('e').value;
        await fetch('/api/payments/process', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ email }) });
        location.href = '/${t.conf}?e=' + encodeURIComponent(email); };</script>`));
  }
  if (url.startsWith('/' + t.conf)) {
    return send(res, 200, 'text/html', html(`<main><p>${t.ok}</p><p id="m"></p></main><script>m.textContent = new URLSearchParams(location.search).get('e')</script>`));
  }
  send(res, 404, 'text/plain', 'nf');
}

function seo(host, url, res) {
  const path = url.split('?')[0];
  const title = 'Titulo de la pagina de ejemplo para SEO ' + path;
  const desc = 'Una descripción suficientemente larga para cumplir con el mínimo de cincuenta caracteres de SEO.';
  const og = path === '/' ? `<meta property="og:title" content="OG título"><meta property="og:image" content="https://${host}/og.png">` : '';
  send(res, 200, 'text/html', html('<main><h1>SEO</h1></main>', `<meta name="description" content="${desc}"><link rel="canonical" href="https://${host}${path}">${og}`).replace('<title>App</title>', `<title>${title}</title>`));
}

const server = https.createServer(loadCert(), (req, res) => {
  const rawHost = (req.headers.host || '').split(':')[0];
  const host = ALIASES[rawHost] ?? rawHost;
  const url = req.url;
  if (L[host]) return shop(host, url, res);
  if (host === 'mi-sitio.ejemplo.com') return seo(rawHost, url, res);

  if (host === 'mi-tabla.ejemplo.com') {
    return send(res, 200, 'text/html', html(`<table><tr><th>Nombre</th><th></th></tr><tr><td>Ana García</td><td><button onclick="d.showModal()">Editar</button></td></tr><tr><td>Luis Pérez</td><td><button>Editar</button></td></tr><tr><td>Anne Martin</td><td><button onclick="d.showModal()">Modifier</button></td></tr></table>
      <dialog id="d" role="dialog"><p>Editando a Ana García / Anne Martin</p><button onclick="d.close()">x</button></dialog>`));
  }
  if (host === 'mi-app-graphql.ejemplo.com') {
    return send(res, 200, 'text/html', html(`<main><form id="f"><label>Email <input id="e"></label><button type="submit">Registrarse</button><button type="submit">S'inscrire</button></form><div id="err"></div></main>
      <script>f.onsubmit = async ev => { ev.preventDefault(); const r = await fetch('/graphql', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ operationName:'CreateUser', variables:{ email: e.value } }) });
        const j = await r.json(); if (j.errors) err.innerHTML = '<div role="alert">'+j.errors[0].message+'</div>'; };</script>`));
  }
  if (host === 'mi-app-ws.ejemplo.com') {
    return send(res, 200, 'text/html', html(`<main><p data-testid="connection-status">connecting</p></main>
      <script>const ws = new WebSocket('wss://' + location.host + '/ws'); ws.onmessage = e => { if (JSON.parse(e.data).status === 'connected') document.querySelector('[data-testid=connection-status]').textContent = 'connected'; };</script>`));
  }
  if (host === 'mi-pwa.ejemplo.com') {
    if (url === '/sw.js') return send(res, 200, 'text/javascript', `self.addEventListener('install', e => e.waitUntil(caches.open('v1').then(c => c.addAll(['/']))));
      self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
      self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));`);
    return send(res, 200, 'text/html', html(`<main><h1>PWA</h1></main><script>navigator.serviceWorker.register('/sw.js')</script>`));
  }

  // mi-app.ejemplo.com (default)
  if (url.startsWith('/api/hello')) return json(res, { message: 'Datos desde HAR', messageFr: 'Données depuis HAR' });
  if (url.startsWith('/api/todos')) return json(res, [{ id: 1, title: 'x' }]);
  if (url.startsWith('/api/users')) return json(res, [{ id: 1, name: 'Real' }]);
  if (url === '/api/jobs/start') { jobStart = Date.now(); return json(res, {}); }
  if (url.startsWith('/api/jobs/')) return json(res, { status: Date.now() - jobStart > 1500 ? 'completed' : 'running' });
  if (url.startsWith('/api/doc')) { if (req.method === 'POST') { let b = ''; req.on('data', c => b += c); req.on('end', () => { doc = JSON.parse(b).text; json(res, {}); }); return; } return json(res, { text: doc }); }
  if (url === '/jobs') {
    return send(res, 200, 'text/html', html(`<main><button id="b">Iniciar proceso</button><button id="b2">Démarrer le processus</button><span data-testid="job-id"></span></main>
      <script>for (const id of ['b','b2']) document.getElementById(id).onclick = () => { document.querySelector('[data-testid=job-id]').textContent = 'job-1'; fetch('/api/jobs/start', {method:'POST'}); };</script>`));
  }
  if (url.startsWith('/doc/')) {
    return send(res, 200, 'text/html', html(`<main><textarea></textarea><p id="seen"></p></main>
      <script>const ta = document.querySelector('textarea'); ta.oninput = () => fetch('/api/doc', {method:'POST', body: JSON.stringify({text: ta.value})});
      setInterval(async () => { const j = await (await fetch('/api/doc')).json(); if (document.activeElement !== ta) { document.getElementById('seen').textContent = j.text; } }, 250);</script>`));
  }
  if (url === '/todos') return send(res, 200, 'text/html', html('<main><ul id="l"></ul></main><script>fetch("/api/todos").then(r=>r.json()).then(t=>{l.innerHTML=t.map(x=>"<li>"+x.title+"</li>").join("")})</script>'));
  if (url === '/usuarios') return send(res, 200, 'text/html', html('<main><ul id="l"></ul></main><script>fetch("/api/users").then(r=>r.json()).then(t=>{l.innerHTML=t.map(x=>"<li>"+x.name+"</li>").join("")})</script>'));
  if (url === '/login') return send(res, 200, 'text/html', html('<main><h1>Login</h1><p>Home</p></main>'));
  return send(res, 200, 'text/html', html(`<main style="min-height:600px"><div data-testid="skeleton">cargando</div><h1 id="h" hidden>Inicio</h1><p id="u"></p><p id="msg"></p><p id="msg-fr"></p>
    <h2 style="font-size:48px">Bienvenido a la aplicación de ejemplo</h2></main>
    <script>
      try { const u = JSON.parse(localStorage.getItem('user')); if (u) document.getElementById('u').textContent = u.name; } catch {}
      fetch('/api/hello').then(r => r.json()).then(j => { document.getElementById('msg').textContent = j.message; document.getElementById('msg-fr').textContent = j.messageFr; });
      setTimeout(() => { document.querySelector('[data-testid=skeleton]').remove(); document.getElementById('h').hidden = false; }, 1200);
    </script>`));
});

const wss = new WebSocketServer({ noServer: true });
server.on('upgrade', (req, sock, head) => wss.handleUpgrade(req, sock, head, ws => ws.send(JSON.stringify({ status: 'connected' }))));
export function startMock() {
  return new Promise(resolve => server.listen(PORT, () => resolve(server)));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) startMock().then(() => console.log('mock up on', PORT));
