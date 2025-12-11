export default {
  name: "menu",
  desc: "Show menu",
  exec: async ({ sock, m, from, config }) => {
    const txt = `
*${config.botName}* - Main Menu

• .alive
• .menu
• .ping
• .ai <text>
• .sticker (reply image)
• .v2t (reply voice note)
• .yta <youtube link>
• .tr <text> (translate to English)
• .toggle <feature> on|off (owner)
`;
    await sock.sendMessage(from, { text: txt });
  }
};
