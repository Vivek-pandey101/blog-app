// at the very top, load your .env
require("dotenv").config();

const { google } = require("googleapis");
const stream = require("stream");

// pull in your four env vars and guard against typos
const CLIENT_ID =
  "338784298979-rup2nq4nlsrsfhhm2rh5mtt30e24cd0o.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "AIzaSyAFcyTqY4Z87MLwUiV1-mxrhjbzw3WdhEw";

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !REFRESH_TOKEN) {
  throw new Error(
    "Google Drive credentials missing—make sure CLIENT_ID, CLIENT_SECRET, REDIRECT_URI and REFRESH_TOKEN are set in your .env"
  );
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
// this tells the client “whenever you need an access_token, use this refresh_token”
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// now create your Drive client
const drive = google.drive({ version: "v3", auth: oauth2Client });

async function uploadToDrive(file) {
  // force a refresh to ensure we have a valid access_token
  await oauth2Client.getAccessToken();

  // turn the in-memory Buffer into a stream
  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);

  // perform the upload
  const response = await drive.files.create({
    requestBody: {
      name: file.originalname,
      mimeType: file.mimetype,
    },
    media: {
      mimeType: file.mimetype,
      body: bufferStream,
    },
    fields: "id, webContentLink, webViewLink",
  });

  const fileId = response.data.id;
  // make it publicly readable
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  return {
    id: fileId,
    url:
      response.data.webContentLink ||
      `https://drive.google.com/uc?export=view&id=${fileId}`,
    name: file.originalname,
  };
}

module.exports = { uploadToDrive };
