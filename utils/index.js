import { links } from "../mocks/links.js";
import axios from "axios";
import { bot } from "../src/app.js";

const CUTTLY_API_KEY = process.env.CUTTLY_API_KEY;
const BITLY_API_KEY = process.env.BITLY_API_KEY;

export const generateCuttlyApiLink = (finalLink) => {
  return `http://cutt.ly/api/api.php?key=${CUTTLY_API_KEY}&short=${encodeURIComponent(finalLink)}`;
};

export const generateFinalLink = ({ telegramIdQuery, playerNameQuery, data }) => {
  // Возвращаем полную ссылку, добавляя параметры
  return `${links.find((item) => item.title === data).link}${telegramIdQuery}${playerNameQuery}`;
};

export const fetchLinksData = async ({ finalLink, chatID }) => {
  const cuttlyLink = generateCuttlyApiLink(finalLink);
  try {
    // Запрос к Cuttly
    console.log(`Запрос к Cuttly: ${cuttlyLink}`);
    const {
      data: {
        url: { shortLink: cuttlyShortLink },
      },
    } = await axios.get(cuttlyLink);
    
    console.log(`Короткая ссылка Cuttly: ${cuttlyShortLink}`);

    // Запрос к Bitly
    const {
      data: { link: bitlyShortLink },
    } = await axios.post(
      'https://api-ssl.bitly.com/v4/shorten',
      {
        long_url: cuttlyShortLink,
      },
      {
        headers: {
          Authorization: `Bearer ${BITLY_API_KEY}`,
        },
      }
    );

    console.log(`Короткая ссылка Bitly: ${bitlyShortLink}`);

    // Формируем текст для одного сообщения
    const message = `
      Исходная ссылка: ${finalLink}
      Короткая ссылка Cuttly: ${cuttlyShortLink}
      Короткая ссылка Bitly: ${bitlyShortLink}
    `;

    // Отправляем все ссылки в одном сообщении
    await bot.sendMessage(chatID, message.trim());

    return {
      cuttlyShortLink,
      bitlyShortLink,
      finalLink,
    };
  } catch (e) {
    console.error('Ошибка при сокращении ссылки:', e);
    await bot.sendMessage(chatID, 'Попробуйте позже');
    return {
      cuttlyShortLink: '',
      bitlyShortLink: '',
      finalLink: '',
    };
  }
};
