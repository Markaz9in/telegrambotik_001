import { links } from "../mocks/links.js";
import axios from "axios";
import { bot } from "../src/app.js";

const TAPNI_API_KEY = process.env.TAPNI_API_KEY;
const CUTTLY_API_KEY = process.env.CUTTLY_API_KEY;

export const generateCuttlyApiLink = (finalLink) => {
  return `http://cutt.ly/api/api.php?key=${CUTTLY_API_KEY}&short=${encodeURIComponent(
    finalLink
  )}`;
};

export const generateFinalLink = ({
  telegramIdQuery,
  playerNameQuery,
  data,
}) => {
  return `${
    links.find((item) => item.title === data).link
  }${telegramIdQuery}${playerNameQuery}`;
};

export const fetchLinksData = async ({ finalLink, chatID }) => {
  const cuttlyLink = generateCuttlyApiLink(finalLink);
  try {
    const {
      data: {
        url: { shortLink: cuttlyShortLink },
      },
    } = await axios.get(cuttlyLink);
    const {
      data: { shorturl: tapniShortLink },
    } = await axios.post(
      "http://tapny.ru/api/url/add",
      {
        url: cuttlyShortLink,
        domain: "https://playswithme.com",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TAPNI_API_KEY}`,
        },
      }
    );

    return {
      cuttlyShortLink,
      tapniShortLink,
      finalLink,
    };
  } catch (e) {
    await bot.sendMessage(chatID, "Попробуйте позже");
    return {
      cuttlyShortLink: "",
      tapniShortLink: "",
      finalLink: "",
    };
  }
};
