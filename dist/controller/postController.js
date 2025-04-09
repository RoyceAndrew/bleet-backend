import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const createPost = async (req, res) => {
    try {
        const { id, ...data } = req.body;
        const post = await prisma.post.create({ data: { ...data, user_id: id } });
        res.status(200).json({ post });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const getProfilePost = async (req, res) => {
    try {
        const { id } = req.body;
        const post = await prisma.post.findMany({ where: { user_id: id }, orderBy: { created_at: "desc" }, include: { user: { select: {
                        displayname: true,
                        profilePicture: true,
                        username: true
                    } }, Like: { select: { user_id: true, post_id: true } } } });
        res.status(200).json({ post });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const deletePost = async (req, res) => {
    try {
        const { postId, id } = req.body;
        const post = await prisma.post.delete({ where: { id: postId, user_id: id } });
        res.status(200).json({ post });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const getAllPosts = async (_req, res) => {
    try {
        const post = await prisma.post.findMany({ orderBy: { created_at: "desc" }, include: { user: { select: {
                        displayname: true,
                        profilePicture: true,
                        username: true
                    } }, Like: { select: { user_id: true, post_id: true } } } });
        res.status(200).json({ post });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const streamPost = async (req, res) => {
    res.setHeader("content-type", "text/event-stream");
    res.setHeader("cache-control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    try {
        const stream = setInterval(async () => {
            try {
                const post = await prisma.post.findMany({ orderBy: { created_at: "desc" }, include: { user: { select: {
                                displayname: true,
                                profilePicture: true,
                                username: true
                            } }, Like: { select: { user_id: true, post_id: true } } } });
                if (post.length > 0) {
                    res.write(`data: ${JSON.stringify(post)}\n\n`);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ error: error.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
            }
        }, 5000);
        req.on("close", () => {
            clearInterval(stream);
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const likePost = async (req, res) => {
    try {
        const { postId, id } = req.body;
        if (!postId) {
            const result = await prisma.like.findMany({ where: { user_id: id } });
            res.status(200).json({ success: true, like: false, data: result });
            return;
        }
        const post = await prisma.like.findFirst({ where: { post_id: postId, user_id: id } });
        if (post) {
            await prisma.like.deleteMany({ where: { post_id: postId, user_id: id } });
            const result = await prisma.like.findMany({ where: { user_id: id } });
            res.status(200).json({ success: true, like: false, data: result });
            return;
        }
        else if (!post) {
            await prisma.like.create({ data: { post_id: postId, user_id: id } });
            const result = await prisma.like.findMany({ where: { user_id: id } });
            res.status(200).json({ success: true, like: true, data: result });
            return;
        }
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const detailPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await prisma.post.findUnique({ where: { id: postId }, include: { user: { select: {
                        displayname: true,
                        profilePicture: true,
                        username: true
                    } }, Like: { select: { user_id: true, post_id: true } } } });
        res.status(200).json({ post });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const upComment = async (req, res) => {
    try {
        const { postId, id, comment } = req.body;
        const result = await prisma.post.create({ data: { reply_to: postId, user_id: id, text: comment } });
        res.status(200).json({ result });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
export { createPost, getProfilePost, deletePost, getAllPosts, streamPost, likePost, detailPost, upComment };
