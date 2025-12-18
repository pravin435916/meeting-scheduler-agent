import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import transcriptRoutes from "./routes/transcript.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/transcripts", transcriptRoutes);

app.get("/", (req, res) => {
  res.send("Voiceboard Scheduling Agent API running");
});

export default app;
