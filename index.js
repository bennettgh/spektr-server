const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3001;
const DATA_DIR_PATH = `${__dirname}/data/`;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors({ credentials: true, origin: "*" }));

const projectIdToFilenameMap = {
  1: "project-1.json",
  2: "project-2.json",
  3: "project-3.json",
  4: "project-4.json",
  5: "project-5.json",
};

app.post("/save/:projectId", (req, res) => {
  const { projectId } = req.params;
  const { assignmentStore, dependencyStore, eventStore, resourceStore } =
    req.body;

  const newData = require(`${DATA_DIR_PATH}/${projectIdToFilenameMap[projectId]}`);

  newData.assignments = assignmentStore || [];
  newData.tasks = eventStore || [];
  newData.resources = resourceStore || [];
  newData.dependencies = dependencyStore || [];

  fs.writeFileSync(
    `${DATA_DIR_PATH}/${projectIdToFilenameMap[projectId]}`,
    JSON.stringify(newData, null, 2)
  );

  res.json(newData);
});

app.post("/clear/:projectId", (req, res) => {
  const { projectId } = req.params;

  try {
    if (projectId === 2 || projectId === "2") {
      const templateData = require(`${DATA_DIR_PATH}/project-2_bu.json`);
      fs.writeFileSync(
        `${DATA_DIR_PATH}/${projectIdToFilenameMap[projectId]}`,
        JSON.stringify(templateData, null, 2)
      );

      return res.json(templateData);
    } else {
      const templateData = require(`${DATA_DIR_PATH}/template.json`);

      fs.writeFileSync(
        `${DATA_DIR_PATH}/${projectIdToFilenameMap[projectId]}`,
        JSON.stringify(templateData, null, 2)
      );

      return res.json(templateData);
    }
  } catch (e) {
    res.send(JSON.stringify(e));
  }
});

app.get("/project/:projectId", (req, res) => {
  const { projectId } = req.params;
  const data = fs.readFileSync(
    `${DATA_DIR_PATH}/${projectIdToFilenameMap[projectId]}`
  );
  res.json(JSON.parse(data));
});

app.get("/test", (req, res) => {
  res.json({ it: "works" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
