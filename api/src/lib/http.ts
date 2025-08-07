export function corsHeaders(origin = 'http://localhost:5173') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  } as Record<string, string>;
}

export function withCors(body: any, status = 200) {
  return {
    status,
    jsonBody: body,
    headers: corsHeaders(),
  } as const;
}

export function ok(status = 200) {
  return { status, headers: corsHeaders() } as const;
}
