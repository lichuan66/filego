import express, { Request, Response } from "express";
const app = express();
const port = 2333;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World1112221!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
