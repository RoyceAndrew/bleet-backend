import express from "express";
import { createPost, getProfilePost } from "../controller/postController.ts";

const router: express.Router = express.Router();

router.post("/create", createPost);

router.get("/profilepost", getProfilePost)

export default router;