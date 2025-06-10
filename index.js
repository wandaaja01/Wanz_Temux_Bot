const { Telegraf } = require("telegraf");
const moment = require("moment-timezone");
const {
  addDB, delDB, listDB,
  addPremium, delPremium, listPremium
} = require("./github");

const bot = new Telegraf("8048602435:AAGOXumH8kOXk-4NILyQAT7Ti6cANLS8naI");

function formatMenu(username, status) {
  const waktu = moment().tz("Asia/Jakarta").format("DD/MM/YYYY, HH.mm.ss");
  return (
`
<b>╔═『 BOTZ INFORMATION 』═╗</b>
<b>│ Hello, @${username}</b>
<b>│ Time:</b> ${waktu}
<b>│ Status:</b> ${status === "premium" ? "👑 PREMIUM" : "🆓 FREE"}
<b>│ Dibuat oleh:</b> Wanz Official
<b>│ Runtime:</b> Termux

<b>│ MENU:</b>
<b>│ _________________________</b>
<b>│ 💾 DATABASE WA</b>
<b>│ ❏ /adddb &lt;no wa&gt;</b>
<b>│ ❏ /deldb &lt;no wa&gt;</b>
<b>│ ❏ /listdb</b>

<b>│ 👑 PREMIUM USER</b>
<b>│ ❏ /addprem &lt;id tele&gt;</b>
<b>│ ❏ /delprem &lt;id tele&gt;</b>
<b>│ ❏ /listprem</b>

<b>│ 🔧 FITUR LAIN</b>
<b>│ ❏ /id</b>
<b>│ ❏ /kick</b>
<b>│ ❏ /add</b>
<b>│ ❏ /tourl</b>
<b>│ ❏ /sticker</b>
<b>│ ❏ /play &lt;judul&gt;</b>
<b>╚═══════════════════════/b>
`
  );
}

// START Command
bot.start(async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    const premiumList = await listPremium();
    const isPremium = premiumList.includes(userId);
    const status = isPremium ? "premium" : "free";

    await ctx.reply(formatMenu(ctx.from.username || "User", status), {
      parse_mode: "HTML"
    });
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Terjadi kesalahan saat menampilkan menu.");
  }
});

// Helper nomor WA
function getArgNomor(text) {
  const args = text.split(" ");
  if (args.length < 2) return null;
  const nomor = args[1].replace(/\D/g, "");
  return nomor.startsWith("0") ? "62" + nomor.slice(1) : nomor;
}

// Helper ID Telegram
function getArgID(text) {
  const args = text.split(" ");
  return args[1] || null;
}

// === DB WA ===
bot.command("adddb", async (ctx) => {
  const nomor = getArgNomor(ctx.message.text);
  if (!nomor) return ctx.reply("❌ Contoh: /adddb 628xxxxxx");
  const success = await addDB(nomor);
  ctx.reply(success ? `✅ Nomor ${nomor} ditambahkan.` : "❌ Nomor sudah ada.");
});

bot.command("deldb", async (ctx) => {
  const nomor = getArgNomor(ctx.message.text);
  if (!nomor) return ctx.reply("❌ Contoh: /deldb 628xxxxxx");
  const success = await delDB(nomor);
  ctx.reply(success ? `✅ Nomor ${nomor} dihapus.` : "❌ Nomor tidak ditemukan.");
});

bot.command("listdb", async (ctx) => {
  const list = await listDB();
  if (list.length === 0) return ctx.reply("📂 Database kosong.");
  ctx.reply("📂 Daftar WA:\n" + list.map((n, i) => `${i + 1}. wa.me/${n}`).join("\n"));
});

// === PREMIUM ===
bot.command("addprem", async (ctx) => {
  const id = getArgID(ctx.message.text);
  if (!id || isNaN(id)) return ctx.reply("❌ Contoh: /addprem 123456789");
  const success = await addPremium(id);
  ctx.reply(success ? `✅ ID ${id} jadi premium.` : "❌ ID sudah ada.");
});

bot.command("delprem", async (ctx) => {
  const id = getArgID(ctx.message.text);
  if (!id || isNaN(id)) return ctx.reply("❌ Contoh: /delprem 123456789");
  const success = await delPremium(id);
  ctx.reply(success ? `✅ ID ${id} dihapus dari premium.` : "❌ ID tidak ditemukan.");
});

bot.command("listprem", async (ctx) => {
  const list = await listPremium();
  if (list.length === 0) return ctx.reply("📂 Premium kosong.");
  ctx.reply("👑 User Premium:\n" + list.map((id, i) => `${i + 1}. ID: ${id}`).join("\n"));
});

// === FITUR LAIN ===
bot.command("id", async (ctx) => {
  ctx.reply(`🆔 ID kamu: ${ctx.from.id}`);
});

bot.command("kick", async (ctx) => {
  ctx.reply("🚫 Fitur kick hanya tersedia untuk admin bot.");
});

bot.command("add", async (ctx) => {
  ctx.reply("➕ Tambahkan user ke grup dengan /invite.");
});

bot.command("tourl", async (ctx) => {
  ctx.reply("🔗 Kirim media untuk diubah ke URL (fitur belum aktif).");
});

bot.command("sticker", async (ctx) => {
  ctx.reply("🎨 Kirim gambar atau video untuk dijadikan sticker.");
});

bot.command("play", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ");
  if (!args) return ctx.reply("🎵 Contoh: /play Despacito");
  ctx.reply(`⏯️ Memutar lagu: *${args}*`, { parse_mode: "Markdown" });
});

// Jalankan bot
bot.launch();
console.log("🤖 Bot Telegram aktif di Termux!");

// Error handler
process.on("unhandledRejection", console.error);
