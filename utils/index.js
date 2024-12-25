import express from 'express';
import axios from 'axios';
import { bot } from "../src/app.js";
import { links } from "../mocks/links.js";

const CUTTLY_API_KEY = process.env.CUTTLY_API_KEY;
const BITLY_API_KEY = process.env.BITLY_API_KEY;
const app = express();
const port = 3000;

app.use(express.static('public')); // Статические файлы

// Функция для генерации ссылки Cuttly
const generateCuttlyApiLink = (finalLink) => {
  return `http://cutt.ly/api/api.php?key=${CUTTLY_API_KEY}&short=${encodeURIComponent(finalLink)}`;
};

// Функция для формирования финальной ссылки
const generateFinalLink = ({ telegramIdQuery, playerNameQuery, data }) => {
  return `${links.find((item) => item.title === data).link}${telegramIdQuery}${playerNameQuery}`;
};

// API для создания короткой ссылки
app.get('/generate-link', async (req, res) => {
  const { telegramIdQuery, playerNameQuery, data } = req.query;

  // Генерируем финальную ссылку
  const finalLink = generateFinalLink({ telegramIdQuery, playerNameQuery, data });

  // Генерация коротких ссылок
  const cuttlyLink = generateCuttlyApiLink(finalLink);
  try {
    // Запрос к Cuttly для получения короткой ссылки
    const { data: { url: { shortLink: cuttlyShortLink } } } = await axios.get(cuttlyLink);

    // Запрос к Bitly для получения еще одной короткой ссылки
    const { data: { link: bitlyShortLink } } = await axios.post(
      'https://api-ssl.bitly.com/v4/shorten',
      { long_url: cuttlyShortLink },
      { headers: { Authorization: `Bearer ${BITLY_API_KEY}` } }
    );

    // Перенаправляем на страницу с кнопкой
    const redirectUrl = `/button-page.html?link=${encodeURIComponent(cuttlyShortLink)}`;
    res.redirect(redirectUrl);
  } catch (e) {
    console.error('Ошибка при сокращении ссылки:', e);
    res.status(500).send('Ошибка при генерации короткой ссылки');
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
