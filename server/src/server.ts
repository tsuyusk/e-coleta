import express from "express";

const app = express();
const port = 3333;

app.get("/users", (req, res) => {
  res.json({ names: ["tsuy", "luna", "abner"] });
  console.log("listagem de usuarios");
});

app.listen(port, () => {
  console.log(`Listening port ${port}`);
});
