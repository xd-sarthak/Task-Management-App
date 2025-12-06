import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

//import all routes
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

//middleware
import { errorHandler } from "./middleware/errorHandler.js"; // implement ApiError & errorHandler (see notes)

dotenv.config();

//env validation
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  CLIENT_URL: z.string().url().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).optional(),
  RATE_LIMIT_MAX: z.string().transform(Number).optional(),
  TRUST_PROXY: z.string().transform((val) => (val === "1" ? 1 : 0)).optional(),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Invalid environment configuration:", parsedEnv.error.format());
  process.exit(1);
}

const env = parsedEnv.data;
const PORT = Number(env.PORT) || 3000;
const NODE_ENV = env.NODE_ENV;

const app = express();

//security
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(compression());

//req parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* SIMPLE REQUEST ID (helpful for correlation in logs) */
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as any).id = uuidv4();
  next();
});

/* RATE LIMITING */
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors());


//health checks
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

//routes
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);


/* 404 */
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const err = new Error("Not Found");
  // forward to centralized error handler
  (err as any).status = 404;
  next(err);
});


app.use(errorHandler);

 //GRACEFUL SHUTDOWN
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received — shutting down gracefully`);

  server.close((err) => {
    if (err) {
      console.error("Error during server close:", err);
      process.exit(1);
    }
    // optionally close DB connections here
    console.log("Closed out remaining connections");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

/* catch unhandled errors and rejections to avoid undefined state */
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception — shutting down:", err);
  // give logger a moment to flush
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection — shutting down:", reason);
  process.exit(1);
});

export default app;
