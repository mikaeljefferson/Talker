const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const talkerPath = path.resolve(__dirname, './talker.json');

async function readTalkerFile() {
  try {
    const response = await fs.readFile(talkerPath, 'utf-8');
    const data = JSON.parse(response);
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

async function allTalkers() {
  const file = await readTalkerFile();
  return file;
}
function randomToken() {
  const token = crypto.randomBytes(8).toString('hex');

  return token;
}
async function writeTalkerFile(talker) {
  try {
    await fs.writeFile(talkerPath, talker);
  } catch (error) {
    console.log(error.message);
  }
}
async function addTalker(talker) {
  const file = await readTalkerFile();

  file.push(talker);
  await writeTalkerFile(JSON.stringify(file));
}
async function updateTalker(object, id) {
  const { name, age, talk } = object;
  const file = await readTalkerFile();
  const findTalker = file.find((item) => item.id === id);

  if (!findTalker) return undefined;

  findTalker.name = name;
  findTalker.age = age;
  findTalker.talk = talk;

  await writeTalkerFile(JSON.stringify(file));

  return findTalker;
}
async function deleteTalker(id) {
  const file = await readTalkerFile();
  const filterFile = file.filter((item) => item.id !== id);

  await writeTalkerFile(JSON.stringify(filterFile));
}

module.exports = {
  allTalkers,
  randomToken,
  readTalkerFile,
  addTalker,
  updateTalker,
  deleteTalker,
};