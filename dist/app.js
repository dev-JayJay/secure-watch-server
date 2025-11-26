import express from "express";
import morgan from "morgan";
import routes from "./routes/index.js";
import * as dotenv from 'dotenv';
dotenv.config();
import { StatusCodes } from "http-status-codes";
const app = express();
app.use(express.json());
app.use(morgan("combined"));
// api routes
app.use('/api', routes);
app.get('/', (req, res) => {
    res.json({
        StatusCode: StatusCodes.OK,
        message: "Welcome to Secure Watch server — it is up and active",
    });
});
// Start the server
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
