import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma: PrismaClient = new PrismaClient();

const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, ...data } = req.body;
        const post = await prisma.post.create({ data: { ...data, user_id: id } });
        res.status(200).json({ post });
    } catch (error: unknown | Error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};

const getProfilePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const {id} = req.body;
      const post = await prisma.post.findMany({where: {user_id: id}, orderBy: {created_at: "desc"}, include: {user: {select: {
        displayname: true,
        profilePicture: true,
        username: true
    }}}})
      res.status(200).json({post})
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
}

const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const {postId, id} = req.body;
      const post = await prisma.post.delete({where: {id: postId, user_id: id}})
      res.status(200).json({post})
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
}

const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const post = await prisma.post.findMany({orderBy: {created_at: "desc"}, include: {user: {select: {
        displayname: true,
        profilePicture: true,
        username: true
      }}}})
      res.status(200).json({post})
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
}

export { createPost, getProfilePost, deletePost, getAllPosts };