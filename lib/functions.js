export function isOwner(jid, ownerNumber) {
  return jid.replace("@s.whatsapp.net", "") === ownerNumber;
}

export function randomReact() {
  const emojis = ["🔥","😂","❤️","😮","👍","😎","💯","👏"];
  return emojis[Math.floor(Math.random()*emojis.length)];
}
