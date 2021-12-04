import { RequestContext } from "../core/mod.ts";

export async function measure(
  ctx: RequestContext,
  next: (ctx: RequestContext) => Promise<Response>,
) {
  // Start time tracking and handle the request.
  const startTime = Date.now();
  const response = await next(ctx);

  // Stop time tracking and log the time.
  const stopTime = Date.now();
  console.log(`Request handled in ${stopTime - startTime} ms`);
  return response;
}
