import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { links } from "../mocks/links.js";
import { LINKS_LIMIT } from "../consts/pagination.js";
import {
  callbackController,
  startController,
  messageController,
} from "../controllers/index.js";

const TOKEN = process.env.BOT_TOKEN;

export const bot = new TelegramBot(TOKEN, { polling: true });

class App {
  async launchBot() {
    let currentListener = [];
    let currentInputValue = "";
    let currentPage = 1;
    let linksTotalCount = links.length;
    let totalPageCount = Math.ceil(linksTotalCount / LINKS_LIMIT);

    bot.onText(/\/start/, startController);

    bot.on("message", async (msg) => {
      const { currentInputValue: inputValue } = await messageController({
        totalPageCount,
        msg,
        currentPage,
        currentListener,
        currentInputValue,
      });
      currentInputValue = inputValue;
    });

    bot.on("callback_query", async (callbackQuery) => {
      const {
        totalPageCount: a,
        currentPage: b,
        currentListener: c,
        currentInputValue: d,
      } = await callbackController({
        callbackQuery,
        currentPage,
        currentInputValue,
        currentListener,
        totalPageCount,
      });
      totalPageCount = a;
      currentPage = b;
      currentListener = c;
      currentInputValue = d;
    });
  }
}

export default App;
