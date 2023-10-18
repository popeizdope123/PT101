const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Define the path to your JSON file
const dataFilePath = 'users.json';

// Read data from the JSON file
function readData() {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
}

// Write data to the JSON file
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Create a new user
app.post('/users', (req, res) => {
  const newUser = req.body;
  const data = readData();
  data.push(newUser);
  writeData(data);
  res.status(201).json(newUser);
});

// Get a list of all users
app.get('/users', (req, res) => {
  const data = readData();
  res.json(data);
});

// Get a single user by ID
app.get('/users/:id', (req, res) => {
  const data = readData();
  const id = req.params.id;
  const user = data.find((user) => user.id == id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const data = readData();
  const id = req.params.id;
  const index = data.findIndex((user) => user.id == id);
  if (index !== -1) {
    const deletedUser = data.splice(index, 1)[0];
    writeData(data);
    res.json(deletedUser);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get Company Name based on employee name
app.get('/company/:employeeName', (req, res) => {
    const data = readData();
    const employeeName = req.params.employeeName;
    const user = data.find((user) => user.employees === employeeName);
    if (user) {
        res.json({ companyName: user.companyName });
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
