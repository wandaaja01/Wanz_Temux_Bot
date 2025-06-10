const axios = require("axios");

const githubToken = "TOKEN_GITHUB_KALIAN";
const repo = "NAMA_GITHUB/NAMA_REPOSITORY";
const dbPath = "NAMA_FILE";

async function fetchFile() {
  const res = await axios.get(`https://api.github.com/repos/${repo}/contents/${dbPath}`, {
    headers: { Authorization: `Bearer ${githubToken}` }
  });
  const { content, sha } = res.data;
  const json = JSON.parse(Buffer.from(content, 'base64').toString());
  return { data: json, sha };
}

async function pushFile(content, sha) {
  const base64 = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
  await axios.put(`https://api.github.com/repos/${repo}/contents/${dbPath}`, {
    message: "update database",
    content: base64,
    sha
  }, {
    headers: { Authorization: `Bearer ${githubToken}` }
  });
}

// === PREMIUM ===

async function getPremium() {
  const { data } = await fetchFile();
  return data.premium || [];
}

async function addPremium(id) {
  const { data, sha } = await fetchFile();
  if (!data.premium) data.premium = [];
  if (data.premium.includes(String(id))) return false;
  data.premium.push(String(id));
  await pushFile(data, sha);
  return true;
}

async function delPremium(id) {
  const { data, sha } = await fetchFile();
  if (!data.premium) data.premium = [];
  if (!data.premium.includes(String(id))) return false;
  data.premium = data.premium.filter(i => i !== String(id));
  await pushFile(data, sha);
  return true;
}

async function listPremium() {
  return await getPremium();
}

// === DATABASE ===

async function listDB() {
  const { data } = await fetchFile();
  return data.number || [];
}

async function addDB(id) {
  const { data, sha } = await fetchFile();
  if (!data.number) data.number = [];
  if (data.number.includes(String(id))) return false;
  data.number.push(String(id));
  await pushFile(data, sha);
  return true;
}

async function delDB(id) {
  const { data, sha } = await fetchFile();
  if (!data.number) data.number = [];
  if (!data.number.includes(String(id))) return false;
  data.number = data.number.filter(i => i !== String(id));
  await pushFile(data, sha);
  return true;
}

module.exports = {
  getPremium,
  addPremium,
  delPremium,
  listPremium,
  addDB,
  delDB,
  listDB
};
