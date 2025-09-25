const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/log", (req: any, res: any) => {
    const { source, message, meta } = req.body ?? {};
    const stamp = new Date().toISOString();
    console.log(`[${stamp}] [${source ?? "unknown"}] ${message}`, meta ?? "");
    res.sendStatus(204);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Log server listening on http://localhost:${port}`);
});