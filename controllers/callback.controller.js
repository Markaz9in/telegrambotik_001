import { createLinkBtn, linksButtons } from "../buttons/index.js";
import { LINKS_LIMIT } from "../consts/pagination.js";
import { fetchLinksData } from "../utils/index.js";
import { bot } from "../src/app.js";
import { links } from "../mocks/links.js";
import { users } from "../mocks/users.js";

export const callbackController = async ({
  callbackQuery,
  totalPageCount,
  currentPage,
  currentListener,
  currentInputValue,
}) => {
  const data = callbackQuery.data;
  if (
    !users.find(
      (item) => item.id.toString() === callbackQuery.message.chat.id.toString()
    )
  ) {
    await bot.sendMessage(
      callbackQuery.message.chat.id,
      "Доступ запр️ещен ⛔."
    );
    return {
      totalPageCount,
      currentPage,
      currentListener,
      currentInputValue,
    };
  }
  if (data === "startCallback") {
    currentListener.push("");
    try {
      await bot.sendMessage(
        callbackQuery.message.chat.id,
        "Отправьте ник игрока 👇"
      );
    } catch (e) {
      console.log(e);
    }
  }
  if (data === "prevLinkPage" || data === "nextLinkPage") {
    if (currentPage === 1 && data === "prevLinkPage")
      return {
        totalPageCount,
        currentPage,
        currentListener,
        currentInputValue,
      };
    if (currentPage === totalPageCount && data === "nextLinkPage")
      return {
        totalPageCount,
        currentPage,
        currentListener,
        currentInputValue,
      };

    if (data === "prevLinkPage") currentPage--;
    if (data === "nextLinkPage") currentPage++;
    const messageID = callbackQuery.message.message_id;
    const chatID = callbackQuery.message.chat.id;
    const controlButtons = [
      { text: "⬅️", callback_data: "prevLinkPage" },
      { text: "➡️", callback_data: "nextLinkPage" },
    ];
    try {
      await bot.editMessageText(
        `Ник игрока: <b>${currentInputValue}</b>\nTelegramID: <b>${chatID}</b>\nВыберите ссылку 👇\nСтраница: <b>${currentPage}</b>/<b>${totalPageCount}</b>`,
        {
          parse_mode: "HTML",
          message_id: messageID,
          chat_id: callbackQuery.message.chat.id,
        }
      );
    } catch (e) {
      console.log(e);
    }
    try {
      await bot.editMessageReplyMarkup(
        {
          inline_keyboard: [
            ...linksButtons.slice(
              (currentPage - 1) * LINKS_LIMIT,
              LINKS_LIMIT + (currentPage - 1) * LINKS_LIMIT
            ),
            controlButtons,
          ],
        },
        { chat_id: chatID, message_id: messageID }
      );
    } catch (e) {
      console.log(e);
    }
  }
  if (links.find((item) => item.title === data)) {
    const chatID = callbackQuery.message.chat.id;
    let telegramIdQuery = "";
    let playerNameQuery = "";
    let subDE = "";
    let sub1 = "";
    let finalLink = "";

    if (data === "HnS/Казино-DE") {
      telegramIdQuery = `&sub_id2=${chatID}`;
      playerNameQuery = `&sub_id3=${currentInputValue}`;
      subDE = "&sub_id4=DE";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    if (data === "Verde/Казино-DE") {
      telegramIdQuery = `&sub_id2=${chatID}`;
      playerNameQuery = `&sub_id3=${currentInputValue}`;
      subDE = "&sub_id4=DE";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    }
    if (data === "QuantumAI-DE") {
      telegramIdQuery = `&custom2=${chatID}`;
      playerNameQuery = `&custom3=${currentInputValue}`;
      subDE = "&custom4=DE";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    if (data === "QuantumAI2-DE") {
      telegramIdQuery = `&custom2=${chatID}`;
      playerNameQuery = `&custom3=${currentInputValue}`;
      subDE = "&custom4=DE";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    if (data === "Вакант") {
      telegramIdQuery = `&sub_id2=${chatID}`;
      playerNameQuery = `&sub_id3=${currentInputValue}`;
      subDE = "&sub_id4=DE";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    if (data === "Вакант") {
      telegramIdQuery = `&custom2=${chatID}`;
      playerNameQuery = `&custom3=${currentInputValue}`;
      subDE = "&custom4=DE";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    if (data === "Вакант") {
      telegramIdQuery = `&sub_id2=${chatID}`;
      playerNameQuery = `&sub_id3=${currentInputValue}`;
      subDE = "&sub_id4=ES";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    if (data === "Вакант") {
      telegramIdQuery = `&sub_id2=${chatID}`;
      playerNameQuery = `&sub_id3=${currentInputValue}`;
      subDE = "&sub_id4=ES";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    if (data === "Вакант") {
      telegramIdQuery = `&sub_id2=${chatID}`;
      playerNameQuery = `&sub_id3=${currentInputValue}`;
      subDE = "&sub_id4=ES";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    if (data === "Вакант") {
      telegramIdQuery = `&sub_id2=${chatID}`;
      playerNameQuery = `&sub_id3=${currentInputValue}`;
      subDE = "&sub_id4=ES";
      finalLink = `${links
        .find((item) => item.title === data)
        .link.toString()}${telegramIdQuery}${playerNameQuery}${subDE}`;
    }
    
    const {
      cuttlyShortLink,
      tapniShortLink,
      finalLink: final,
    } = await fetchLinksData({
      finalLink,
      data,
      chatID,
    });
    const option = {
      reply_markup: {
        inline_keyboard: [createLinkBtn],
      },
    };
    try {
      if (cuttlyShortLink && tapniShortLink && finalLink)
        await bot.sendMessage(
          chatID,
          `<b>Исходная ссылка:</b> ${final}\n<b>Cuttly:</b> ${cuttlyShortLink}\n<b>Tapny:</b> ${tapniShortLink}`,
          { parse_mode: "HTML" }
        );
    } catch (e) {
      console.log(e);
    }
    try {
      await bot.sendMessage(chatID, "Выберите действие 👇", option);
    } catch (e) {
      console.log(e);
    }
    currentListener.pop();
  }
  return {
    totalPageCount,
    currentPage,
    currentListener,
    currentInputValue,
  };
};
