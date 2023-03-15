const express = require('express');
const { allTalkers, randomToken } = require('./talker');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
// 1 - Crie o endpoint GET /talker
app.get('/talker', async (req, res) => {
  const talkers = await allTalkers();

  if (!!talkers && talkers.length === 0) {
    return res.status(200).json([]);
  }

  return res.status(200).json(talkers);
});
// 2 - Crie o endpoint GET /talker/:id
app.get('/talker/:id', async (req, res) => {
  const { id: talkerId } = req.params;
  const talkers = await allTalkers();
  const talkerById = talkers.find(({ id }) => id === +talkerId);
  if (!talkerById) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(talkerById);
});
// 3 - Crie o endpoint POST /login
app.post('/login', (req, res) => {
  const token = randomToken();

  return res.status(200).json({ token });
});