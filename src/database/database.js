import path from "path";
import Logger from "../utils/logger";
import mongoose from "mongoose";

try {
  mongoose.connect("mongodb://localhost:27017/Jungle");
  Logger.info("Connected to Database");
} catch (error) {
  Logger.error("Could not connect to the database");
}
