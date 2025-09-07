import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes/index";



dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("combined"));


// api routes
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});