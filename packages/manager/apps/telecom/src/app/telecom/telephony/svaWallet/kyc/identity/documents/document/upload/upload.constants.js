export const extensions = ['.png', '.jpg', '.jpeg', '.pdf'];

export const extensionRegExp = new RegExp(
  `(${extensions.map((ext) => `\\${ext}`).join('|')})$`,
);

export const accept = extensions.join(',');

export default {
  accept,
  extensionRegExp,
  extensions,
};
