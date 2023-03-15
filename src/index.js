const express = require('express');
const { allTalkers, randomToken,
   addTalker,
    readTalkerFile,
    updateTalker } = require('./talker');
const emailValidation = require('./middleware/validacao/emailValidation');
const passwordValidation = require('./middleware/validacao/passwordValidation');
const authorizationValidation = require('./middleware/validacao/authorizationValidation');
const nameValidation = require('./middleware/validacao/nameValidation');
const ageValidation = require('./middleware/validacao/ageValidation');
const talkValidation = require('./middleware/validacao/talkValidation ');
const watchedAtValidation = require('./middleware/validacao/ watchedAtValidation');
const rateValidation = require('./middleware/validacao/rateValidation');

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
// 4 - Adicione as validações para o endpoint /login
app.post('/login',
  emailValidation,
  passwordValidation,
  (req, res) => {
    const token = randomToken();

    return res.status(200).json({ token });
  });
  // 5 - Crie o endpoint POST /talker
  app.post('/talker',
  authorizationValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
  async (req, res) => {
    const talker = req.body;

    const file = await readTalkerFile();
    const lastFile = file[file.length - 1];
    const newTalker = { id: lastFile.id + 1, ...talker };

    await addTalker(newTalker);

    return res.status(201).json(newTalker);
  });
  // 6 - Crie o endpoint PUT /talker/:id
  app.put('/talker/:id',
  authorizationValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
  async (req, res) => {
    const { id } = req.params;
    const talker = req.body;

    const updatedTalker = await updateTalker(talker, Number(id));

    if (!updatedTalker) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }

    return res.status(200).json(updatedTalker);
  });