const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db.json");
const uuid = require("./helpers/uuid");
const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/notes", (req, res) => {
  // res.send("<h1>hello world</h1>");

  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    res.json(JSON.parse(data));
  });
  // console.info(database);
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    let newArr = [];
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      newArr = JSON.parse(data);
      newArr.push(newNote);
      console.log(newArr);
      fs.writeFile("./db/db.json", JSON.stringify(newArr), (err) =>
        err
          ? console.error(err)
          : console.log(`New note added: ${newNote.title}`)
      );
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("error posting the note");
  }
});

// DELETE request to delete notes
// app.delete("/api/notes/:id", (req, res) => {
//   let id = req.params.id;
//   fs.readFile("./db/db.json", "utf8", (err, data) => {
//     res.json(JSON.parse(data));
//   });
// });

app.get("/*", (req, res) => {
  // res.send("<h1>hello world</h1>");
  res.sendFile(path.join(__dirname, "/public/index.html"), (err) => {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", "index.html");
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening at https://localhost:${PORT}`);
});
