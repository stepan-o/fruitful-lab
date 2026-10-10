import { createHash } from "node:crypto";
// A standalone recovery document intentionally omits the site's analytics and
// third-party scripts. The bearer token stays in the URL fragment, then memory.
const styles = `*{box-sizing:border-box}body{margin:0;background:#f7f9f0;color:#254c42;font:16px/1.6 Arial,sans-serif}main{max-width:470px;margin:5vh auto;padding:32px;background:#fff;border:1px solid #dfe6d8;border-radius:24px}header{display:flex;align-items:center;justify-content:space-between;gap:16px}a{color:inherit}header a{font-size:14px;text-decoration:none;max-width:210px;line-height:1.2}button,input{font:inherit}button,a.action{min-height:46px;border-radius:12px;padding:11px 16px;border:0;background:#254c42;color:white;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;text-decoration:none}button:disabled{opacity:.5;cursor:default}#language{color:#254c42;background:#f1f4e7}h1{font:36px/1.1 Georgia,serif;letter-spacing:-.03em;margin:36px 0 16px}p{color:#68776e;font-size:14px}label{display:grid;gap:7px;font-size:13px;margin:18px 0}input{width:100%;padding:12px;border:1px solid #cad5c8;border-radius:10px;min-height:48px;color:#254c42;background:#fff}form>button{width:100%;margin-top:8px}small{display:block;color:#748075;font-size:12px}#message{padding:12px;border-radius:10px;background:#fff2e9;color:#863d32;font-size:14px}#success{border-radius:18px;background:#edf3df;padding:22px;margin:25px 0}#success h2{font:28px Georgia,serif;margin:0 0 14px}#retry{display:inline-flex;align-items:center;min-height:44px;font-size:13px;margin-top:16px}footer{margin-top:24px;border-top:1px solid #e4e9dd;padding-top:16px;font-size:12px;color:#748075}*:focus-visible{outline:3px solid #d2876c;outline-offset:3px}[hidden]{display:none!important}@media(max-width:520px){main{margin:0;min-height:100dvh;padding:25px 22px;border:0;border-radius:0}h1{font-size:33px}}`;
const script = `(() => {
let token = new URLSearchParams(location.hash.slice(1)).get('token') || '';
history.replaceState(null, '', location.pathname + location.search);
let locale = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'es';
let busy = false, complete = false;
const copy = {
 title: ['Tu próxima salida empieza aquí.', 'Your next outing starts here.'],
 intro: ['Elige una contraseña para tu cuenta de Fruitful Lab. Este enlace es privado y sirve una sola vez.', 'Choose a password for your Fruitful Lab account. This private link works once.'],
 passwordLabel: ['Contraseña nueva', 'New password'], confirmLabel: ['Repite la contraseña', 'Repeat password'],
 hint: ['Al menos 10 caracteres. Puedes usar una frase.', 'At least 10 characters. A passphrase works well.'],
 submit: ['Guardar contraseña', 'Save password'], retry: ['Necesito otro enlace', 'I need another link'],
 successTitle: ['Tu cuenta está lista.', 'Your account is ready.'], successText: ['Ya puedes entrar con tu correo y contraseña nueva. Cerramos las sesiones anteriores de esta cuenta.', 'Sign in with your email and new password. Previous sessions for this account are signed out.'],
 login: ['Entrar al juego', 'Enter the game'], footer: ['Una misma cuenta para Fruitful Lab y Mexico city discovery game.', 'One account for Fruitful Lab and Mexico city discovery game.']
};
const errors = {
 invalid: ['Este enlace venció, ya se usó o fue reemplazado. Pide otro para continuar.', 'This link expired, was used or was replaced. Request another to continue.'],
 mismatch: ['Las contraseñas no coinciden. Revísalas antes de guardar.', 'The passwords do not match. Check them before saving.'],
 service: ['No pudimos guardar tu contraseña. Inténtalo de nuevo en un momento.', 'We couldn’t save your password. Try again shortly.']
};
let error = '';
function render() {
 document.documentElement.lang = locale === 'es' ? 'es-MX' : 'en';
 document.title = locale === 'es' ? 'Tu contraseña · Fruitful Lab' : 'Your password · Fruitful Lab';
 document.getElementById('form').hidden = complete || error === 'invalid';
 for (const [id, words] of Object.entries(copy)) document.getElementById(id).textContent = words[locale === 'es' ? 0 : 1];
 document.getElementById('language').textContent = locale === 'es' ? 'EN' : 'ES';
 document.getElementById('language').setAttribute('aria-label', locale === 'es' ? 'English' : 'Español');
 document.getElementById('retry').href = '/mexico-city/play?auth=forgot';
 const message = document.getElementById('message'); message.hidden = !error;
 message.textContent = error ? errors[error][locale === 'es' ? 0 : 1] : '';
 document.getElementById('submit').disabled = busy || !token;
}
if (!/^[A-Za-z0-9_-]{32,128}$/.test(token)) { token = ''; error = 'invalid'; }
document.getElementById('language').addEventListener('click', () => { locale = locale === 'es' ? 'en' : 'es'; render(); });
document.getElementById('form').addEventListener('submit', async event => {
 event.preventDefault(); if (busy || !token) return;
 const password = document.getElementById('password').value;
 if (password !== document.getElementById('confirm').value) { error = 'mismatch'; render(); return; }
 busy = true; error = ''; render();
 try {
  const response = await fetch('/api/account/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password, locale }) });
  if (!response.ok) { error = response.status === 400 || response.status === 422 ? 'invalid' : 'service'; }
  else {
   complete = true; token = ''; document.getElementById('form').reset(); document.getElementById('form').hidden = true;
   document.getElementById('intro').hidden = true; document.getElementById('retry').hidden = true;
   document.getElementById('success').hidden = false; document.getElementById('login').focus();
  }
 } catch { error = 'service'; }
 finally { busy = false; render(); }
});
render();
})();`;
export function GET() {
  const html = `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><title>Tu contraseña · Fruitful Lab</title><style>${styles}</style></head><body><main><header><a href="/mexico-city">✳ Mexico city discovery game</a><button id="language" type="button" aria-label="English">EN</button></header><h1 id="title">Tu próxima salida empieza aquí.</h1><p id="intro">Elige una contraseña para tu cuenta de Fruitful Lab.</p><form id="form"><label><span id="passwordLabel">Contraseña nueva</span><input id="password" name="password" type="password" autocomplete="new-password" required minlength="10" maxlength="128"></label><small id="hint">Al menos 10 caracteres.</small><label><span id="confirmLabel">Repite la contraseña</span><input id="confirm" name="confirm" type="password" autocomplete="new-password" required minlength="10" maxlength="128"></label><button id="submit" type="submit">Guardar contraseña</button></form><p id="message" role="alert" hidden></p><section id="success" role="status" hidden><h2 id="successTitle">Tu cuenta está lista.</h2><p id="successText"></p><a id="login" class="action" href="/mexico-city/play">Entrar al juego</a></section><a id="retry" href="/mexico-city/play?auth=forgot">Necesito otro enlace</a><footer id="footer"></footer><noscript>Activa JavaScript para usar este enlace privado. / Enable JavaScript to use this private link.</noscript></main><script>${script}</script></body></html>`;
  const sha = (source: string) =>
    createHash("sha256").update(source).digest("base64");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Content-Security-Policy": `default-src 'none'; script-src 'sha256-${sha(script)}'; style-src 'sha256-${sha(styles)}'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`,
    },
  });
}
