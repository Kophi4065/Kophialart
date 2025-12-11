import fs from "fs-extra";
import path from "path";

const commands = new Map();

export async function loadCommands() {
  const commandsPath = path.join(process.cwd(), "commands");
  if (!fs.existsSync(commandsPath)) return;
  for (const file of fs.readdirSync(commandsPath)) {
    if (!file.endsWith(".js")) continue;
    const mod = await import(path.join(commandsPath, file));
    if (mod?.default?.name) commands.set(mod.default.name, mod.default);
  }
  console.log("Loaded commands:", [...commands.keys()]);
}

export async function handleMessage(sock, upsert, config, store, saveStore) {
  const messages = upsert?.messages || [];
  const m = messages[0];
  if (!m) return;
  if (m.key && m.key.fromMe) return;

  const text =
    (m.message?.conversation) ||
    (m.message?.extendedTextMessage?.text) ||
    (m.message?.imageMessage?.caption) ||
    (m.message?.videoMessage?.caption) || "";

  const from = m.key.remoteJid;
  const sender = (m.key.participant || from).replace("@s.whatsapp.net", "");
  const isOwner = sender === config.ownerNumber;

  // Auto-read
  if (store.autoRead && m.key) {
    try { await sock.readMessages([m.key]); } catch {}
  }

  // Auto-react messages
  if (store.autoReactMessages && m.key) {
    try { await sock.sendMessage(from, { react: { text: "🔥", key: m.key } }); } catch {}
  }

  // Presence before commands
  if (text && text.startsWith(config.prefix)) {
    if (store.autoTyping) { try { await sock.sendPresenceUpdate("composing", from); } catch {} }
    if (store.autoRecording) { try { await sock.sendPresenceUpdate("recording", from); } catch {} }
  }

  if (!text || !text.startsWith(config.prefix)) return;
  const without = text.slice(config.prefix.length).trim();
  if (!without) return;
  const [cmdName, ...args] = without.split(/\s+/);
  const cmd = commands.get(cmdName.toLowerCase());

  if (!cmd) {
    await sock.sendMessage(from, { text: `Unknown command: ${cmdName}` });
    return;
  }

  // public/private check
  if (!store.public && !isOwner) {
    await sock.sendMessage(from, { text: "Bot is private. Only owner can use commands." });
    return;
  }

  try {
    await cmd.exec({ sock, m, from, sender, args, config, store, saveStore });
  } catch (e) {
    console.error("Command failed", e);
    await sock.sendMessage(from, { text: "Command error: " + (e.message || e) });
  }
}
