const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "*" }));

const PATH = `${__dirname}/data/`;

let reqId = 1;

app.post("/changes", (req, res) => {
  const {
    assignmentStore,
    dependencyStore,
    eventStore,
    resourceStore,
    project,
  } = req.body;

  const projectData = require(`${PATH}/${project}`);

  projectData.assignments = projectData.assignments || { rows: [] };
  projectData.assignments.rows = assignmentStore;

  projectData.tasks = projectData.tasks || { rows: [] };
  projectData.tasks.rows = eventStore;

  projectData.resources = projectData.resources || { rows: [] };
  projectData.resources.rows = resourceStore;

  projectData.dependencies = projectData.dependencies || { rows: [] };
  projectData.dependencies.rows = dependencyStore;

  fs.writeFileSync(`${PATH}/${project}`, JSON.stringify(projectData, null, 2));

  res.json({
    success: true,
    requestId: reqId++,
  });
});

app.post("/clear", (req, res) => {
  const { project } = req.body;

  const templateData = require(`${PATH}/template.json`);

  fs.writeFileSync(`${PATH}/${project}`, JSON.stringify(templateData, null, 2));

  res.json({
    success: true,
    requestId: reqId++,
  });
});

app.get("/", (req, res) => {
  const data = require(`${PATH}/project-1.json`);
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
