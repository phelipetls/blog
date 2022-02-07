const RssParser = require("rss-parser");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

function diffXmlFeedItems(newXml, oldXml) {
  const oldXmlItems = oldXml.items.map((item) => item.guid);

  const newXmlItems = newXml.items.filter(
    (item) => !oldXmlItems.includes(item.guid)
  );

  return newXmlItems;
}

async function getLocalXmlFeed() {
  const localXmlFeedPath = path.join(__dirname, "../public/posts/index.xml");
  const localXmlFeed = fs.readFileSync(localXmlFeedPath);

  const parser = new RssParser();
  return parser.parseString(localXmlFeed);
}

async function getDeployedXmlFeed() {
  const parser = new RssParser();
  const url = "https://phelipetls.github.io/posts/index.xml";
  return parser.parseURL(url);
}

async function getNewXmlFeedItems() {
  const localXmlFeed = await getLocalXmlFeed();
  const deployedXmlFeed = await getDeployedXmlFeed();

  return diffXmlFeedItems(localXmlFeed, deployedXmlFeed);
}

async function sendEmail(body) {
  const createEmailUrl = BUTTONDOWN_BASE_URL + "/v1/emails";

  return fetch(createEmailUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${BUTTONDOWN_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
}

const BUTTONDOWN_BASE_URL = "https://api.buttondown.email";
const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;

(async () => {
  const newPosts = await getNewXmlFeedItems();

  if (newPosts.length === 0) {
    console.log("No new posts. Nothing to do.");
    process.exit(0);
  }

  for (const newPost of newPosts) {
    const url = new URL(newPost.link);

    const bodyPath = path.join(
      __dirname,
      "..",
      "/public",
      "email",
      url.pathname,
      "index.md"
    );

    const body = fs.readFileSync(bodyPath, "utf8");

    const response = await sendEmail({
      subject: newPost.title + " - phelipetls.github.io",
      body,
      external_url: newPost.link,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[${response.status}] Could not send email: \n${text}`);

      if (response.status === 400 && text === 'You have already sent an email with an identical subject and body.') {
        process.exit(0);
      }

      process.exit(1);
    }

    console.log("Successfully sent email about new post:", newPost.title);
  }
})();
