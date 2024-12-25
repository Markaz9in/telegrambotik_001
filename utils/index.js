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
        // 1. Запрос к Cuttly
        console.log(`Запрос к Cuttly: ${cuttlyLink}`);
        const {
            data: {
                url: { shortLink: cuttlyShortLink },
            },
        } = await axios.get(cuttlyLink);

        console.log(`Короткая ссылка Cuttly: ${cuttlyShortLink}`);

        // 2. Преобразование для формата MentorHans
        const mentorHansLink = `https://mentorhans.ru?url=${encodeURIComponent(cuttlyShortLink)}`;
        console.log(`Ссылка MentorHans: ${mentorHansLink}`);

        // 3. Запрос к Bitly для сокращения ссылки MentorHans
        const {
            data: { link: bitlyShortLink },
        } = await axios.post(
            'https://api-ssl.bitly.com/v4/shorten',
            { long_url: mentorHansLink },
            {
                headers: {
                    Authorization: `Bearer ${BITLY_API_KEY}`,
                },
            }
        );

        console.log(`Короткая ссылка Bitly: ${bitlyShortLink}`);

        // 4. Красивое финальное сообщение
        const message = `
<b>Готово! 🎉</b>\n
Исходная ссылка: <a href="${finalLink}">${finalLink}</a>\n
Короткая ссылка Cuttly: <a href="${cuttlyShortLink}">${cuttlyShortLink}</a>\n
Ссылка MentorHans: <a href="${mentorHansLink}">${mentorHansLink}</a>\n
Короткая ссылка Bitly: <a href="${bitlyShortLink}">${bitlyShortLink}</a>
`;

        // Отправка сообщения в Telegram
        await bot.sendMessage(chatID, message, { parse_mode: 'HTML' });

        return {
            cuttlyShortLink,
            mentorHansLink,
            bitlyShortLink,
            finalLink,
        };
    } catch (e) {
        console.error('Ошибка при сокращении ссылки:', e);

        // Отправляем сообщение об ошибке
        await bot.sendMessage(chatID, '⚠️ Ошибка! Попробуйте позже.', { parse_mode: 'HTML' });

        return {
            cuttlyShortLink: '',
            mentorHansLink: '',
            bitlyShortLink: '',
            finalLink: '',
        };
    }
};