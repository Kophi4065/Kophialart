export default {
  botName: "Kophialart Bot",
  ownerName: "Kophialart",
  ownerNumber: "233556956753",    // no @s.whatsapp.net
  prefix: ".",
  defaults: {
    public: false,
    alwaysOnline: true,
    autoTyping: true,
    autoRecording: true,
    autoReactMessages: true,
    autoViewStatus: true,
    autoReactStatus: true,
    antiDelete: true,
    antiViewOnce: true,
    autoRead: true,
    antiCall: true,
    ChatBotMode: false
  },
  sessionFolder: "./auth/",
  mediaFolder: "./media/",
  port: process.env.PORT || 3000,
  messages: {
    owner: "❗ Only my owner can use this command.",
    wait: "⏳ Processing..."
  }
};
