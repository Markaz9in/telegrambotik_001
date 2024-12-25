import { links } from "../mocks/links.js";
import axios from "axios";
import { bot } from "../src/app.js";

const CUTTLY_API_KEY = process.env.CUTTLY_API_KEY;
const TINYURL_API_KEY = process.env.TINYURL_API_KEY;

export const generateCuttlyApiLink = (finalLink) => {
  return `http://cutt.ly/api/api.php?key=${CUTTLY_API_KEY}&short=${encodeURIComponent(finalLink)}`;
};

export const generateFinalLink = ({ telegramIdQuery, playerNameQuery, data }) => {
  return `${links.find((item) => item.title === data).link}${telegramIdQuery}${playerNameQuery}`;
};

export const fetchLinksData = async ({ finalLink, chatID }) => {
  const cuttlyLink = generateCuttlyApiLink(finalLink);
  try {
    // Получаем короткую ссылку с Cuttly
    const {
      data: {
        url: { shortLink: cuttlyShortLink },
      },
    } = await axios.get(cuttlyLink);

    // Запрос к TinyURL API для сокращения ссылки
    const tinyUrlApiUrl = 'https://api.tinyurl.com/create';
    const response = await axios.post(
      tinyUrlApiUrl,
      { url: cuttlyShortLink },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TINYURL_API_KEY}`,
        },
      }
    );

    // Ожидаем, что в ответе будет поле 'data' с сокращённой ссылкой
    const tinyUrlShortLink = response.data.data.tiny_url;

    return {
      cuttlyShortLink,
      tinyUrlShortLink,
      finalLink,
    };
  } catch (e) {
    console.error('Error during link shortening:', e); // Логирование ошибки
    await bot.sendMessage(chatID, "Попробуйте позже");
    return {
      cuttlyShortLink: "",
      tinyUrlShortLink: "",
      finalLink: "",
    };
  }
};
