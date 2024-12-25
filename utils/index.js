import { links } from "../mocks/links.js";
import axios from "axios";
import { bot } from "../src/app.js";

const BITLY_API_KEY = process.env.BITLY_API_KEY;
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

// New function for Bitly API
export const generateBitlyLink = async (longUrl) => {
  try {
    const response = await axios.post(
      "https://api-ssl.bitly.com/v4/shorten",
      {
        long_url: longUrl,
        domain: "bit.ly",
      },
      {
        headers: {
          Authorization: `Bearer ${BITLY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.link; // Returns the shortened link
  } catch (error) {
    console.error("Error with Bitly API:", error.message);
    throw new Error("Failed to generate Bitly link");
  }
};

export const fetchLinksData = async ({ finalLink, chatID }) => {
  const cuttlyLink = generateCuttlyApiLink(finalLink);
  try {
    // Get Cuttly short link
    const {
      data: {
        url: { shortLink: cuttlyShortLink },
      },
    } = await axios.get(cuttlyLink);

    // Generate Bitly short link
    const bitlyShortLink = await generateBitlyLink(cuttlyShortLink);

    return {
      cuttlyShortLink,
      bitlyShortLink,
      finalLink,
    };
  } catch (e) {
    await bot.sendMessage(chatID, "Попробуйте позже");
    return {
      cuttlyShortLink: "",
      bitlyShortLink: "",
      finalLink: "",
    };
  }
};
