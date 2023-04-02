const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.port || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const data = [
  { id: 1, author: 'Baz', message: 'Hello' },
  { id: 2, author: 'ChatGPT', message: 'Hi' },
];

app.get('/', (req, res) => {
  res.status(200).json({ success: true, info: 'get all messages', data: data });
});

app.get('/:id', (req, res) => {
  const paramsId = Number(req.params.id);
  const message = data.find((message) => message.id === paramsId);
  res.status(200).json({ success: true, info: `get message id ${paramsId}`, data: [message] });
});

app.post('/', (req, res) => {
  const { author, message } = req.body;
  const newEntry = { id: data.length + 1, author: author, message: message };
  data.push(newEntry);
  res.status(200).json({ success: true, info: 'created message', entry: newEntry, data: data });
});

app.put('/:id', (req, res) => {
  const paramsId = Number(req.params.id);
  const indexOfMessageInData = data.findIndex((message) => message.id === paramsId);
  // const messageToUpdate = data[indexOfMessageInData];
  const { message } = req.body;
  data[indexOfMessageInData] = { ...data[indexOfMessageInData], message: message };
  res.status(200).json({
    success: true,
    info: 'updated message',
    entry: data[indexOfMessageInData],
    data: data,
  });
});

app.delete('/:id', (req, res) => {
  const paramsId = Number(req.params.id);
  const indexOfMessageInData = data.findIndex((message) => message.id === paramsId);
  const messageToDelete = data[indexOfMessageInData];
  data.splice(indexOfMessageInData, 1);
  res.status(200).json({
    success: true,
    info: 'deleted message',
    entry: messageToDelete,
    data: data,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
