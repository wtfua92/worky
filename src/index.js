require("dotenv").config();

const { App } = require("@slack/bolt");
const mongoose = require("mongoose");

const Employee = require("./data/model/employee");
const { getTotalMessage, getRandomEmoji, getAttachment } = require("./helpers");

const URL = `mongodb+srv://wtfua92:${process.env.MONGO_PASS}@worky.oo4hj.mongodb.net/worky?retryWrites=true&w=majority`;

mongoose
  .connect(URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e);
  });

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.message("start", async ({ message, say }) => {
  const employeeId = message.user;

  let employee = await Employee.findOne({ employeeId });

  if (!employee) {
    employee = new Employee({ employeeId });
  }

  employee.workLog.push({
    startedWork: new Date(),
  });

  await employee.save();
  await say(getAttachment(`Have a great working day! ${getRandomEmoji()}`));
});

app.message("finish", async ({ message, say }) => {
  const employeeId = message.user;
  const employee = await Employee.findOne({ employeeId });

  employee.lastWorkEntry.finishedWork = new Date();

  await employee.save();
  await say(getAttachment(`Bye bye, see you tomorrow! ${getRandomEmoji()}`));
});

app.message(
  /(total)(\s\d{1,2}(.\d{1,2})?)?/,
  async ({ message, context, say }) => {
    const employeeId = message.user;
    const rate = context.matches[2];
    const employee = await Employee.findOne({ employeeId });
    let totalMessage = getTotalMessage(employee.lastWeekTotal);

    if (rate) {
      const rateDigit = parseFloat(rate);
      totalMessage = getTotalMessage(employee.lastWeekTotal, rateDigit);
    }

    await say(getAttachment(totalMessage));
  }
);

app.message("help", async ({ say }) => {
  const attachment = {
    attachments: [],
  };
  attachment.attachments.push({
    title: "Worky supports these commands",
    color: "#a47dff",
    fields: [
      { value: "", title: "" },
      { value: "Start work", title: "start" },
      { value: "Finish work", title: "finish" },
      { value: "Total work time over the last week", title: "total" },
      {
        value: "Total work time + total earnings. For example `total 8`",
        title: "total [your rate]",
      },
    ],
  });

  await say(attachment);
});

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("we're in");
  } catch (error) {
    console.log(error);
  }
})();
