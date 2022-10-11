const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3001;
const DATA_DIR_PATH = `${__dirname}/data/`;

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "*" }));

app.post("/save/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { assignmentStore, dependencyStore, eventStore, resourceStore } =
    req.body;

  // const tasks = cleanEvents(eventStore);

  const newData = require(`${DATA_DIR_PATH}/project-${projectId}.json`);

  newData.assignments = assignmentStore || [];
  newData.tasks = eventStore || [];
  newData.resources = resourceStore || [];
  newData.dependencies = dependencyStore || [];

  fs.writeFileSync(
    `${DATA_DIR_PATH}/project-${projectId}.json`,
    JSON.stringify(newData, null, 2)
  );

  res.json(newData);
});

app.post("/clear/:projectId", (req, res) => {
  const { projectId } = req.params;

  console.log("NUKING", projectId);

  const templateData = require(`${DATA_DIR_PATH}/template.json`);

  try {
    fs.writeFileSync(
      `${DATA_DIR_PATH}/project-${projectId}.json`,
      JSON.stringify(templateData, null, 2)
    );

    res.json(templateData);
  } catch (e) {
    res.send(JSON.stringify(e));
  }
});

app.get("/project/:projectId", (req, res) => {
  const { projectId } = req.params;
  console.log(projectId);
  const data = fs.readFileSync(`${DATA_DIR_PATH}/project-${projectId}.json`);
  res.json(JSON.parse(data));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
