import { bot } from "../src/app.js";
import { createLinkBtn } from "../buttons/index.js";
import { users } from "../mocks/users.js";

export const startController = async (msg) => {
  const chatID = msg.chat.id;
  if (!users.find((item) => item.id.toString() === chatID.toString())) {
    await bot.sendMessage(chatID, "Доступ запр️ещен ⛔.");
    return;
  }
  const option = {
    reply_markup: {
      inline_keyboard: [createLinkBtn],
    },
  };
  await bot.sendMessage(chatID, "Выберите действие 👇", option);
};

