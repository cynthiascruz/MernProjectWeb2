import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

interface Login {
  email: string;
  password: string;
}

app.get("/", (req: Request, res: Response) => {
  res.send("TESTING");
});

app.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body as Login;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const token = jwt.sign({ email }, "secret_test", { expiresIn: "1h" });

  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
