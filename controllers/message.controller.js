import { controlButtons, linksButtons } from "../buttons/index.js";
import { LINKS_LIMIT } from "../consts/pagination.js";
import { bot } from "../src/app.js";
import { users } from "../mocks/users.js";

export const messageController = async ({
  totalPageCount,
  currentPage,
  msg,
  currentListener,
  currentInputValue,
}) => {
  if (!currentListener.length) {
    return { currentInputValue };
  }
  if (!users.find((item) => item.id.toString() === msg.chat.id.toString())) {
    await bot.sendMessage(msg.chat.id, "Доступ запр️ещен ⛔.");
    return { currentInputValue };
  }
  currentInputValue = msg.text;
  const option = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        ...linksButtons.slice(
          (currentPage - 1) * LINKS_LIMIT,
          LINKS_LIMIT + (currentPage - 1) * LINKS_LIMIT
        ),
        controlButtons,
      ],
    }),
  };
  try {
    await bot.sendMessage(
      msg.chat.id,
      `Ник игрока: <b>${currentInputValue}</b>\nTelegramID: <b>${msg.chat.id}</b>\nВыберите ссылку 👇\nСтраница: <b>${currentPage}</b>/<b>${totalPageCount}</b>`,
      option
    );
  } catch (e) {
    console.log(e);
  }
  currentListener.pop();
  return { currentInputValue };
};
