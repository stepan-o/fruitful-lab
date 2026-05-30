export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  if (url.hostname === "www.bloomwhispers.com") {
    url.hostname = "bloomwhispers.com";
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
