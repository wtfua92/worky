const { emojies } = require("./constants");

function getTotalMessage(hours, rate) {
  let baseMessage = `You worked \`${hours}\` hours over the last week.`;

  if (rate) {
    baseMessage = `${baseMessage} You earned \`${
      hours * rate
    } USD\`. Don't forget to send a payment request by the *end of Friday* and enjoy your weekend. Thanks for hard work`;
  }

  return `${baseMessage} ${getRandomEmoji()}`;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getRandomEmoji(emojiList = emojies) {
  const randomNumber = getRandomInt(0, emojiList.length - 1);
  return emojiList[randomNumber];
}

function getAttachment(text = "") {
  return {
    attachments: [
      {
        color: "#a47dff",
        text,
      },
    ],
  };
}

module.exports = {
  getAttachment,
  getTotalMessage,
  getRandomEmoji,
};
