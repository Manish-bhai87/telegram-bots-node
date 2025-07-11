
const { Telegraf, session , Markup} = require("telegraf");
const bot = new Telegraf("YOUR_BOT_TOKEN");
const channels = [
  "@channel1",
  "@channel2",
  "Check",
];
const apkFiles = {
  apk1: {
    file_id: 'ENTER_YOUR_FILE_ID_OF_APK',
    label: '🍿 Apk Name',
    caption: '🎬 Premium APK\nNo ads, full access.',
  },
  apk2: {
    file_id: 'ENTER_YOUR_FILE_ID_OF_APK',
    label: '🤖Apk name',
    caption: '🧠 Chat with smart AI – 24/7.',
  },
  apk3: {
    file_id: 'ENTER_YOUR_FILE_ID_OF_APK',
    label: '🎧 Premium',
    caption: '🎶 Ad-free high-quality music.',
  },
  apk4: {
    file_id: 'ENTER_YOUR_FILE_ID_OF_APK',
    label: '🎭 Apki',
    caption: '📺 Originals unlocked & fully free.',
  },
  apk5: {
    file_id: 'ENTER_YOUR_FILE_ID_OF_APK',
    label: '🔥 app_name',
    caption: '🏏 free.',
  }
};

bot.use(async (ctx, next) => {

  const chatId = ctx.chat.id;
  const chu = ctx.from.first_name;

  if (await checkChannels(ctx, channels)) {
    return next();
  } else {
    const keyboard = channels.map((channel) => {
      if (channel !== "Check") {
        return {
          text: "Join",
          url: `https://t.me/${channel.slice(1)}`,
        };
      } else {
        return {
          text: "Unlock Premium",
          callback_data: "verify",
        };
      }
    });

    const key = [];
    for (let i = 0; i < keyboard.length; i += 2) {
      key.push(keyboard.slice(i, i + 2));
    }

    const message = `<b>👋 Hello ${chu} \n\n कृपया सभी चैनलों को ज्वाइन करें ।</b>`;
    await ctx.telegram.sendMessage(ctx.from.id, message, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: key },
    });

  }
});
bot.action("verify", async (ctx) => {
    
     const buttons = Object.entries(apkFiles).map(([key, apk]) => {
    return [Markup.button.callback(apk.label, `getapk_${key}`)];
  });
  buttons.push([Markup.button.url('💬 Contact Admin', 'https://t.me/@')]);

  ctx.reply('📲 *Available Premium APKs:*\n👇 Tap to download your favorite app!', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(buttons) // ✅ THIS is the fix that makes buttons work!
  });
});

bot.start((ctx) => {
  const buttons = Object.entries(apkFiles).map(([key, apk]) => {
    return [Markup.button.callback(apk.label, `getapk_${key}`)];
  });
  buttons.push([Markup.button.url('💬 Contact Admin', 'https://t.me/@')]);

  ctx.reply('📲 *Available Premium APKs:*\n👇 Tap to download your favorite app!', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(buttons) 
  });
});

// 🟢 Handle button press (callback)
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data.startsWith('getapk_')) {
    const key = data.replace('getapk_', '');
    const apk = apkFiles[key];

    if (apk) {
      await ctx.replyWithDocument(apk.file_id, {
        caption: apk.caption,
        parse_mode: 'Markdown',
      });
    } else {
      await ctx.reply('❌ APK not found.');
    }
  }

  await ctx.answerCbQuery(); 
});

async function checkChannels(ctx, channels) {
  for (var channel of channels) {
    if (channel == "Check") {
      channel = "@channel1";
    }
 
    const result = await ctx.telegram
      .getChatMember(channel, ctx.from.id)
      .catch(() => null);
    if (
      !result ||
      !["member", "administrator", "creator"].includes(result.status)
    ) {
      return false;
    }
  }
  return true;
}
function isNumber(n) {
  return Number(n) === n;
}
function Mc(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

 
bot.launch({ dropPendingUpdates: true });
