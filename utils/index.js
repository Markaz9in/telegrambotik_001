import { links } from "../mocks/links.js";
import axios from "axios";
import { bot } from "../src/app.js";

// Переменные окружения (от Heroku)
const CUTTLY_API_KEY = process.env.CUTTLY_API_KEY;
const BITLY_API_KEY = process.env.BITLY_API_KEY; // Новый API ключ для Bitly
const BITLY_API_KEY = process.env.BITLY_API_KEY;

export const generateCuttlyApiLink = (finalLink) => {
return `http://cutt.ly/api/api.php?key=${CUTTLY_API_KEY}&short=${encodeURIComponent(finalLink)}`;
@@ -17,53 +16,49 @@
export const fetchLinksData = async ({ finalLink, chatID }) => {
const cuttlyLink = generateCuttlyApiLink(finalLink);
try {
    // Запрос к Cuttly
console.log(`Запрос к Cuttly: ${cuttlyLink}`);
    // Получаем короткую ссылку с Cuttly
const {
data: {
url: { shortLink: cuttlyShortLink },
},
} = await axios.get(cuttlyLink);

    if (!cuttlyShortLink) {
      throw new Error("Cuttly API did not return a short link.");
    }

    
console.log(`Короткая ссылка Cuttly: ${cuttlyShortLink}`);

    // Создаем запрос к Bitly для сокращения ссылки
    const bitlyApiUrl = `https://api-ssl.bitly.com/v4/shorten`;
    const headers = {
      "Authorization": `Bearer ${BITLY_API_KEY}`,
      "Content-Type": "application/json",
    };
    const body = {
      long_url: cuttlyShortLink,
    };

    // Отправляем запрос к Bitly
    const response = await axios.post(bitlyApiUrl, body, { headers });
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

    console.log('Ответ от Bitly:', response.data);
    console.log(`Короткая ссылка Bitly: ${bitlyShortLink}`);

    // Получаем короткую ссылку от Bitly
    const bitlyShortLink = response.data.link;
    // Отправка сообщений в Telegram
    await bot.sendMessage(chatID, `Короткая ссылка Cuttly: ${cuttlyShortLink}`);
    await bot.sendMessage(chatID, `Короткая ссылка Bitly: ${bitlyShortLink}`);

return {
cuttlyShortLink,
bitlyShortLink,
finalLink,
};
} catch (e) {
    console.error('Ошибка при сокращении ссылки:', e.message); 
    console.error('Stack trace:', e.stack);

    await bot.sendMessage(chatID, "Попробуйте позже");

    console.error('Ошибка при сокращении ссылки:', e);
    await bot.sendMessage(chatID, 'Попробуйте позже');
return {
      cuttlyShortLink: "",
      bitlyShortLink: "",
      finalLink: "",
      cuttlyShortLink: '',
      bitlyShortLink: '',
      finalLink: '',
};
}
};