(async () => {
  const keyBase64 = "PASTE_YOUR_KEY";
  const ivBase64 = "PASTE_YOUR_IV";

  const key = crypto.subtle.importKey(
    "raw",
    Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0)),
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const response = await fetch("js/script.enc");
  const encrypted = await response.arrayBuffer();

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    await key,
    encrypted
  );

  const code = new TextDecoder().decode(decrypted);
  eval(code);

  // Optional: self-destruct
  window.crypto = undefined;
})();
