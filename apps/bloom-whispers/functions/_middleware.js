export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  let shouldRedirect = false;

  if (url.hostname === "www.bloomwhispers.com") {
    url.hostname = "bloomwhispers.com";
    shouldRedirect = true;
  }

  const datedPostMatch = url.pathname.match(/^\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/);

  if (datedPostMatch) {
    url.pathname = `/${datedPostMatch[1]}/`;
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
