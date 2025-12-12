export default {
  name: "v2t",
  desc: "voice note to text (send voice note reply with .v2t)",
  exec: async ({ sock, m }) => {
    const type = Object.keys(m.message)[0];
    if (type !== "audioMessage" && type !== "voiceMessage") return await sock.sendMessage(m.key.remoteJid, { text: "Reply to a voice note with .v2t" });
    const buffer = await sock.downloadMediaMessage(m);
    const axios = (await import("axios")).default;
    try {
      const res = await axios.post("https://api.safone.ai/speech-to-text", buffer, { headers: { "Content-Type": "audio/ogg" }, timeout: 20000 });
      const text = res.data?.text || "Could not transcribe.";
      await sock.sendMessage(m.key.remoteJid, { text: "🗣️ " + text });
    } catch (e) {
      await sock.sendMessage(m.key.remoteJid, { text: "Voice->Text failed." });
    }
  }
};
