export default {
  name: "welcome",
  desc: "send welcome/goodbye cards (called from index.js)",
  exec: async ({ sock, update }) => {
    // placeholder for compatibility
  }
};

export default async function(sock, update) {
  const fs = await import("fs");
  const id = update.id;
  const action = update.action;
  const participant = update.participants[0];
  if (action === "add") {
    const img = fs.readFileSync("./media/welcome.jpg");
    await sock.sendMessage(id, { image: img, caption: `Welcome @${participant.split("@")[0]}`, mentions: [participant] });
  } else if (action === "remove") {
    await sock.sendMessage(id, { text: `Goodbye @${participant.split("@")[0]}`, mentions: [participant] });
  }
}
