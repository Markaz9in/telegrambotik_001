import { links } from "../mocks/links.js";
import axios from "axios";
import { bot } from "../src/app.js";

// Переменные окружения (от Heroku)
const CUTTLY_API_KEY = process.env.CUTTLY_API_KEY;
const TINYURL_API_KEY = process.env.TINYURL_API_KEY; // Мы его используем, если потребуется для авторизации

if (!CUTTLY_API_KEY) {
  console.error("CUTTLY_API_KEY is not defined in the environment variables.");
}

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

    // Проверка, если Cuttly не вернул короткую ссылку
    if (!cuttlyShortLink) {
      throw new Error("Cuttly API did not return a short link.");
    }

    // Запрос к публичному API TinyURL для сокращения ссылки
    const tinyUrlApiUrl = `https://api.tinyurl.com/create?url=${encodeURIComponent(cuttlyShortLink)}`;
    const response = await axios.get(tinyUrlApiUrl);

    // Проверка, если TinyURL вернул пустой ответ
    if (!response.data) {
      throw new Error("TinyURL API did not return a valid response.");
    }

    // Ответ от TinyURL
    const tinyUrlShortLink = response.data;

    return {
      cuttlyShortLink,
      tinyUrlShortLink,
      finalLink,
    };
  } catch (e) {
    console.error('Error during link shortening:', e.message); // Логирование ошибки с сообщением
    await bot.sendMessage(chatID, "Попробуйте позже");
    return {
      cuttlyShortLink: "",
      tinyUrlShortLink: "",
      finalLink: "",
    };
  }
};
