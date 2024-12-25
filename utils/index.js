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

        // Преобразование для формата MentorHans
        const mentorHansLink = `https://mentorhans.ru?url=${encodeURIComponent(cuttlyShortLink)}`;
        console.log(`Ссылка MentorHans: ${mentorHansLink}`);

        // Запрос к Bitly для сокращения ссылки MentorHans
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

        // Отправка сообщений в Telegram
        await bot.sendMessage(chatID, `Исходная ссылка: ${finalLink}`);
        await bot.sendMessage(chatID, `Короткая ссылка Cuttly: ${cuttlyShortLink}`);
        await bot.sendMessage(chatID, `Ссылка MentorHans: ${mentorHansLink}`);
        await bot.sendMessage(chatID, `Короткая ссылка Bitly: ${bitlyShortLink}`);

        return {
            cuttlyShortLink,
            mentorHansLink,
            bitlyShortLink,
            finalLink,
        };
    } catch (e) {
        console.error('Ошибка при сокращении ссылки:', e);
        await bot.sendMessage(chatID, 'Попробуйте позже');
        return {
            cuttlyShortLink: '',
            mentorHansLink: '',
            bitlyShortLink: '',
            finalLink: '',
        };
    }
};