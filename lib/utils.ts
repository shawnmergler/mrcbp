export function b64(bytes: ArrayBuffer) {
  const buf = Buffer.from(bytes);
  return buf.toString('base64');
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
