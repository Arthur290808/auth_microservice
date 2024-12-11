import express from "express";
import { router as loginRouter } from "./user/index.js";
import { validateToken } from "./user/jwt.js";
import { logData } from "./user/logfunction.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/login", loginRouter);
app.post("/validateToken", validateToken);
app.post("/logdata", logData);
//app.use("/register", registerRouter);

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});