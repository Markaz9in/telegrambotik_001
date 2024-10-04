import { links } from "../mocks/links.js";

export const controlButtons = [
  { text: "⬅️", callback_data: "prevLinkPage" },
  { text: "➡️", callback_data: "nextLinkPage" },
];

export const createLinkBtn = [
  { text: "Создать ссылку", callback_data: "startCallback" },
];

export const linksButtons = links.map((item) => {
  return [{ text: item.title, callback_data: item.title }];
});

