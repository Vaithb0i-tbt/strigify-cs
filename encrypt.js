export async function encryptJS(jsText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(jsText);

  const keyRaw = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey("raw", keyRaw, { name: "AES-CBC" }, false, ["encrypt"]);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, data);

  return {
    encryptedBlob: new Blob([new Uint8Array(encrypted)], { type: "application/octet-stream" }),
    keyBase64: btoa(String.fromCharCode(...keyRaw)),
    ivBase64: btoa(String.fromCharCode(...iv))
  };
}
