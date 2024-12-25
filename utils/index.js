import { links } from "../mocks/links.js";
import axios from "axios";
import { bot } from "../src/app.js";

const CUTTLY_API_KEY = process.env.CUTTLY_API_KEY;
const BITLY_API_KEY = process.env.BITLY_API_KEY;

export const generateCuttlyApiLink = (finalLink) => {
  return `http://cutt.ly/api/api.php?key=${CUTTLY_API_KEY}&short=${encodeURIComponent(finalLink)}`;
};

export const generateFinalLink = ({ telegramIdQuery, playerNameQuery, data }) => {
  // Формируем полную ссылку, добавляя параметры
  const finalLink = `${links.find((item) => item.title === data).link}${telegramIdQuery}${playerNameQuery}`;

  // Генерируем ссылку на страницу с кнопкой, передавая исходную ссылку как параметр
  const redirectPageLink = `https://yourdomain.com/redirect-page.html?link=${encodeURIComponent(finalLink)}`;
  
  return redirectPageLink;  // Возвращаем ссылку на страницу с кнопкой
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

    // Генерация ссылки на HTML страницу с кнопкой
    const htmlPageLink = generateFinalLink({ finalLink: cuttlyShortLink, chatID, data: 'exampleData' });

    // Формируем текст для одного сообщения
    const message = `
      Исходная ссылка: ${finalLink}
      Короткая ссылка Cuttly: ${cuttlyShortLink}
      Короткая ссылка Bitly: ${bitlyShortLink}
      Перейдите по ссылке для активации алгоритма: ${htmlPageLink}
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
