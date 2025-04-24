import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma: PrismaClient = new PrismaClient();

const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, ...data } = req.body;
    const post = await prisma.post.create({ data: { ...data, user_id: id } });
    res.status(200).json({ post });
  } catch (error: unknown | Error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

const getProfilePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const posts = await prisma.post.findMany({
      where: { user: { username: username }, reply_to: null },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            displayname: true,
            profilePicture: true,
            username: true,
          },
        },
        Like: { select: { user_id: true, post_id: true } },
      },
    });
    const postIds = posts.map((post) => post.id);

    const comments = await prisma.post.findMany({
      where: {
        reply_to: { in: postIds },
      },
    });
    res.status(200).json({ posts, comments });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

const getProfileReply = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body;
    const posts = await prisma.post.findMany({
      where: { user_id: id, reply_to: { not: null } },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            displayname: true,
            profilePicture: true,
            username: true,
          },
        },
        Like: { select: { user_id: true, post_id: true } },
      },
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, id } = req.body;
    const post = await prisma.post.delete({
      where: { id: postId, user_id: id },
    });
    res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      where: { reply_to: null },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            displayname: true,
            profilePicture: true,
            username: true,
          },
        },
        Like: { select: { user_id: true, post_id: true } },
      },
    });
    const postIds = posts.map((post) => post.id);

    const comments = await prisma.post.findMany({
      where: {
        reply_to: { in: postIds },
      },
    });
    res.status(200).json({ posts, comments });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

// const streamPost = async (req: Request, res: Response): Promise<void> => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   let isRunning = false;

//   const stream = setInterval(async () => {
//     if (isRunning) return;
//     isRunning = true;

//     try {
//       const posts = await prisma.post.findMany({
//         where: { reply_to: null },
//         orderBy: { created_at: "desc" },
//         include: {
//           user: {
//             select: {
//               displayname: true,
//               profilePicture: true,
//               username: true,
//             },
//           },
//           Like: { select: { user_id: true, post_id: true } },
//         },
//       });

//       // const postIds = posts.map((post) => post.id);

//       // const comments = await prisma.post.findMany({
//       //   where: { reply_to: { in: postIds } },
//       // });

//       if (posts.length > 0) {
//         res.write(`data: ${JSON.stringify( posts )}\n\n`);
//       }
//     } catch (error) {
//       console.error("Error in SSE stream:", error);
//       res.write(`event: error\ndata: ${JSON.stringify({ error: "Something went wrong" })}\n\n`);
//     } finally {
//       isRunning = false;
//     }
//   }, 5000);

//   req.on("close", () => {
//     clearInterval(stream);
//   });
// };

const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, id } = req.body;
    if (!postId) {
      const result = await prisma.like.findMany({ where: { user_id: id } });
      res.status(200).json({ success: true, like: false, data: result });
      return;
    }
    const post = await prisma.like.findFirst({
      where: { post_id: postId, user_id: id },
    });
    if (post) {
      await prisma.like.deleteMany({ where: { post_id: postId, user_id: id } });
      const result = await prisma.like.findMany({ where: { user_id: id } });
      res.status(200).json({ success: true, like: false, data: result });
      return;
    } else if (!post) {
      await prisma.like.create({ data: { post_id: postId, user_id: id } });
      const result = await prisma.like.findMany({ where: { user_id: id } });
      res.status(200).json({ success: true, like: true, data: result });
      return;
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

const detailPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            displayname: true,
            profilePicture: true,
            username: true,
          },
        },
        Like: { select: { user_id: true, post_id: true } },
      },
    });

    res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

const upComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, id, comment } = req.body;
    const result = await prisma.post.create({
      data: { reply_to: postId, user_id: id, text: comment },
    });
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

const getComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findMany({
      orderBy: { created_at: "desc" },
      where: { reply_to: postId },
      include: {
        user: {
          select: {
            displayname: true,
            profilePicture: true,
            username: true,
          },
        },
        Like: { select: { user_id: true, post_id: true } },
      },
    });
    res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

const repost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId, id } = req.body;
    const result = await prisma.repost.create({
      data: { post_id: postId, user_id: id },
    });
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
};

export {
  createPost,
  getProfilePost,
  deletePost,
  getAllPosts,
  // streamPost,
  likePost,
  detailPost,
  upComment,
  getComment,
  getProfileReply,
  repost,
};
