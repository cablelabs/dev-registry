const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openapiDocument = YAML.load('./developers.yaml');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/developer-api', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
// });

mongoose.connect('mongodb://registry-db:27017/developer-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Developer and Contact Mongoose schemas
const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: String,
  phone: String,
  role: String,
});

const DeveloperSchema = new mongoose.Schema({
  company: { type: String, required: true },
  emailAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  contacts: [ContactSchema],
});

const Developer = mongoose.model('Developer', DeveloperSchema);

// Define the API routes
app.post('/developers', async (req, res) => {
  const developer = new Developer(req.body);
  await developer.save();
  res.status(201).json(developer);
});

app.get('/developers', async (req, res) => {
  const developers = await Developer.find();
  res.json(developers);
});

app.put('/developers/:id', async (req, res) => {
  const developer = await Developer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(developer);
});

app.delete('/developers/:id', async (req, res) => {
  await Developer.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Serve the OpenAPI documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
