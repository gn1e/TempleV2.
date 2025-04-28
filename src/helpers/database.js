import path from "path";
import logger from "./logger";
import mongoose from "mongoose";

try {
  mongoose.connect("mongodb://localhost:27017/Jungle");
  logger.info("Connected to Database");
} catch (error) {
  logger.error("Could not connect to the database");
}
