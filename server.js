const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect("mongodb+srv://Keerthivasn:keerthi123@curd.tfsf2.mongodb.net/curd", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    image: String,
    date: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', ProjectSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.get('/projects', async (req, res) => {
    const projects = await Project.find();
    res.send(projects);
});

app.get('/projects/:id', async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.send(project);
});

app.post('/projects', upload.single('image'), async (req, res) => {
    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        image: req.file ? req.file.path : ''
    });
    await project.save();
    res.send(project);
});

app.post('/projects', upload.single('image'), async (req, res) => {
    console.log('File:', req.file);
    console.log('Body:', req.body);

    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        image: req.file ? req.file.path : ''
    });
    await project.save();
    res.send(project);
});


const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
