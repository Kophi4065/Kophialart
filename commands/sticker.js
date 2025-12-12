export default {
  name: "sticker",
  desc: "convert image to webp sticker",
  exec: async ({ sock, m }) => {
    const path = "./media/input.jpg";
    const type = Object.keys(m.message)[0];
    if (type !== "imageMessage") return await sock.sendMessage(m.key.remoteJid, { text: "Reply to an image with .sticker" });
    const buffer = await sock.downloadMediaMessage(m);
    const fs = await import("fs");
    const { spawn } = await import("child_process");
    fs.writeFileSync(path, buffer);
    const out = "./media/sticker.webp";
    const ff = spawn("ffmpeg", ["-i", path, "-vcodec", "libwebp", "-vf", "scale=512:512:force_original_aspect_ratio=decrease", "-lossless", "1", "-preset", "picture", "-an", "-vsync", "0", out]);
    ff.on("close", async () => {
      const sticker = fs.readFileSync(out);
      await sock.sendMessage(m.key.remoteJid, { sticker });
      fs.unlinkSync(path);
      fs.unlinkSync(out);
    });
  }
};
