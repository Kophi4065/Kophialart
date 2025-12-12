import makeWASocket, { fetchLatestBaileysVersion, useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import express from "express";
import config from "./config.js";
import { loadStore, saveStore } from "./store.js";
import { loadCommands, handleMessage } from "./handler.js";
import fs from "fs-extra";
import { randomReact } from "./lib/functions.js";

const logger = pino({ level: "silent" });

async function start() {
  await loadCommands();
  const defaults = config.defaults || {};
  const store = loadStore(defaults);

  // tiny express server so Koyeb health check passes
  const app = express();
  app.get("/", (req, res) => res.send(`${config.botName} is running`));
  const port = process.env.PORT || config.port || 3000;
  app.listen(port, () => console.log(`HTTP server listening on ${port}`));

  // Auth state
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionFolder);
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [4,0,0] }));

  const sock = makeWASocket({
    logger,
    printQRInTerminal: true,
    auth: state,
    version
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (upd) => {
    const { connection, lastDisconnect, qr } = upd;
    if (qr) { qrcode.generate(qr, { small: true }); console.log("Scan QR to pair."); }
    if (connection === "open") console.log("Connected ✅");
    if (connection === "close") {
      console.warn("Connection closed, reconnecting...");
      setTimeout(start, 2000);
    }
  });

  // Messages handler
  sock.ev.on("messages.upsert", async (m) => {
    try {
      // keepalive presence
      if (store.alwaysOnline) {
        try { await sock.sendPresenceUpdate("available"); } catch {}
      }

      const msgs = m.messages || [];
      const msg = msgs[0];
      if (!msg) return;
      if (msg.key && msg.key.fromMe) return;

      // Auto-react (random)
      if (store.autoReactMessages) {
        try { await sock.sendMessage(msg.key.remoteJid, { react: { text: randomReact(), key: msg.key } }); } catch {}
      }

      // Anti-view-once
      if (store.antiViewOnce && msg.message?.viewOnceMessage) {
        try {
          const inner = msg.message.viewOnceMessage.message;
          await sock.sendMessage(msg.key.remoteJid, inner);
        } catch (e) { console.log("viewonce", e); }
      }

      // Auto-AI mode (respond to non-commands if enabled)
      try {
        const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const cfgFile = "./config.json";
        let runtimeCfg = { autoAI: false };
        if (fs.existsSync(cfgFile)) runtimeCfg = fs.readJsonSync(cfgFile);
        if (runtimeCfg.autoAI && !body.startsWith(config.prefix)) {
          const axios = (await import("axios")).default;
          const res = await axios.get("https://api.safone.tech/ai?query=" + encodeURIComponent(body), { timeout: 10000 });
          const reply = res.data?.response || "Sorry I couldn't process that.";
          await sock.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });
          return;
        }
      } catch(e) {}

      // pass to handler (commands)
      await handleMessage(sock, m, config, store, saveStore);

    } catch (e) {
      console.error("messages.upsert err", e);
    }
  });

  // Anti-delete (protocolMessage type 0)
  sock.ev.on("messages.update", async (updates) => {
    try {
      for (const u of updates) {
        if (u.message === null && u.key && !u.key.fromMe) {
          if (!store.antiDelete) continue;
          const jid = u.key.remoteJid;
          try {
            await sock.sendMessage(jid, { text: "⚠️ Anti-Delete: someone deleted a message — I tried to recover it." });
            // If you enable msgstore persistence, this is where you'd resend the saved original.
          } catch (e) { console.log("anti-delete send err", e); }
        }
      }
    } catch (e) { console.log("messages.update err", e); }
  });

  // Group participant updates -> welcome/leave
  sock.ev.on("group-participants.update", async (update) => {
    try {
      const welcome = (await import("./commands/welcome.js")).default;
      await welcome(sock, update);
    } catch(e) { console.log("group-part update err", e); }
  });

  // Calls -> anti-call
  sock.ev.on("call", async (json) => {
    try {
      if (!store.antiCall) return;
      const caller = json[0]?.from;
      if (!caller) return;
      await sock.sendMessage(caller, { text: "🚫 Calling the bot is not allowed. Contact via message." });
      await sock.updateBlockStatus(caller, "block");
    } catch (e) { console.log("call err", e); }
  });

  console.log("Kophialart Bot started.");
}

start().catch(err => console.error(err));
