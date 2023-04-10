const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const cors = require('cors');
const fs = require("fs");
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const readFromDatabase = () => {
  return JSON.parse(fs.readFileSync("./database.json"));
}

const writeToDatabase = (data) => {
  return fs.writeFileSync("./database.json", JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
  const data = readFromDatabase();

  res.status(200).json({
    success: true,
    info: 'get all messages',
    data: data
  });
});

app.get('/:id', (req, res) => {
  const data = readFromDatabase();
  const paramsId = Number(req.params.id);
  console.log("paramsId:", paramsId);
  const message = data.find((message) => message.id === paramsId);
  console.log("message:", message);

  if (!message) {
    res.status(400).json({
      success: false,
      info: `no message with id ${paramsId} found`,
      data: []
    })
    return;
  }

  res.status(200).json({
    success: true,
    info: `get message id ${paramsId}`,
    data: [message]
  });
});

app.post('/', async (req, res) => {
  let data = readFromDatabase();

  const { author, message } = req.body;
  const newEntry = { id: data.length + 1, author: author, message: message };
  data.push(newEntry);

  writeToDatabase(data);

  data = readFromDatabase();

  res.status(200).json({
    success: true,
    info: 'created message',
    entry: newEntry, data: data
  });
});

app.put('/:id', (req, res) => {
  let data = readFromDatabase();

  const paramsId = Number(req.params.id);
  const indexOfMessageInData = data.findIndex((message) => message.id === paramsId);

  if (indexOfMessageInData === -1) {
    res.status(400).json({
      success: false,
      info: `no message with id ${paramsId} found to update`,
      data: []
    })
    return;
  }

  const { message } = req.body;
  data[indexOfMessageInData] = { ...data[indexOfMessageInData], message: message };

  writeToDatabase(data);

  data = readFromDatabase();

  res.status(200).json({
    success: true,
    info: 'updated message',
    entry: data[indexOfMessageInData],
    data: data,
  });
});

app.delete('/:id', (req, res) => {
  let data = readFromDatabase();

  const paramsId = Number(req.params.id);
  const indexOfMessageInData = data.findIndex((message) => message.id === paramsId);

  console.log("indexOfMessageInData:", indexOfMessageInData);
  if (indexOfMessageInData === -1) {
    res.status(400).json({
      success: false,
      info: `no message with id ${paramsId} found to delete`,
      data: []
    })
    return;
  }

  const messageToDelete = data[indexOfMessageInData];
  data.splice(indexOfMessageInData, 1);
  writeToDatabase(data);
  data = readFromDatabase();

  res.status(200).json({
    success: true,
    info: 'deleted message',
    entry: messageToDelete,
    data: data,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});
