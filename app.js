import { encryptJS } from './encrypt.js';

document.getElementById("encryptBtn").addEventListener("click", async () => {
  const file = document.getElementById("txtFile").files[0];
  if (!file) return alert("Please upload a .txt file.");

  const jsCode = await file.text();
  const { encryptedBlob, keyBase64, ivBase64 } = await encryptJS(jsCode);

  const encryptedUrl = URL.createObjectURL(encryptedBlob);

  // Generate loader with embedded key/IV
  const loaderCode = `
(async () => {
  const key = Uint8Array.from(atob("${keyBase64}"), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob("${ivBase64}"), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey("raw", key, "AES-CBC", false, ["decrypt"]);

  const response = await fetch("script.enc.js");
  const encrypted = await response.arrayBuffer();

  const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, cryptoKey, encrypted);
  const code = new TextDecoder().decode(decrypted);

  eval(code);
})();
`;

  const loaderBlob = new Blob([loaderCode], { type: 'application/javascript' });
  const loaderUrl = URL.createObjectURL(loaderBlob);

  document.getElementById("output").innerHTML = `
    <p>✅ JS Encrypted.</p>
    <a href="${encryptedUrl}" download="script.enc.js">Download Encrypted JS</a><br>
    <a href="${loaderUrl}" download="loader.js">Download Loader</a><br><br>
    <textarea rows="4" cols="60" readonly>KEY: ${keyBase64}\nIV: ${ivBase64}</textarea>
  `;
});
