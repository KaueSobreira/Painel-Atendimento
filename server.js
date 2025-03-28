const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const fs = require('fs');

// 1. Limpeza total da sessão anterior
try {
  fs.rmSync('./auth_info', { recursive: true, force: true });
  console.log('✅ Pasta auth_info limpa com sucesso');
} catch (err) {
  console.log('ℹ️ Não foi possível limpar a pasta auth_info');
}

// 2. Conexão simplificada e eficaz
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    version: [2, 2412, 9],
    browser: ["Windows", "Chrome", "118.0.0"],
    // Configurações críticas:
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 20000,
    markOnlineOnConnect: false,
    fireInitQueries: false,
    // Solução para erro 405:
    patchMessageBeforeSending: (msg) => msg,
    retryRequestDelayMs: 1000,
    maxRetryAttempts: 3
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === "open") {
      console.log("✅ Conectado com sucesso!");
    }
    
    if (connection === "close") {
      const error = lastDisconnect?.error;
      console.log("🔴 Conexão fechada:", error?.message || error);
      
      // Reconexão imediata
      setTimeout(connectToWhatsApp, 5000);
    }
  });

  return sock;
}

// 3. Iniciar conexão
connectToWhatsApp().catch(err => {
  console.error('Erro inicial:', err);
  setTimeout(connectToWhatsApp, 5000);
});