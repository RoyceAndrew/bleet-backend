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
        const { username } = req.params;
        const user = await prisma.user.findUnique({ where: { username } });
        const following = await prisma.follow.findMany({ where: { user_id: user?.id } });
        const follower = await prisma.follow.findMany({ where: { following_id: user?.id } });
        const posts = await prisma.post.findMany({
            where: { user: { username: username }, reply_to: null },
            orderBy: { created_at: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        displayname: true,
                        profilePicture: true,
                        username: true,
                        bio: true,
                        website: true,
                        banner: true,
                        createAt: true,
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
        res.status(200).json({ posts, comments, user: user, following, follower });
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
const getProfileReply = async (req, res) => {
    try {
        const { id } = req.body;
        const posts = await prisma.post.findMany({
            where: { user_id: id, reply_to: { not: null } },
            orderBy: { created_at: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        displayname: true,
                        profilePicture: true,
                        username: true,
                    },
                },
                Like: { select: { user_id: true, post_id: true } },
            },
        });
        res.status(200).json({ posts });
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
        const post = await prisma.post.delete({
            where: { id: postId, user_id: id },
        });
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
        const posts = await prisma.post.findMany({
            where: { reply_to: null },
            orderBy: { created_at: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        displayname: true,
                        profilePicture: true,
                        username: true,
                        bio: true,
                        website: true,
                        banner: true,
                        createAt: true,
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
        const followers = await prisma.follow.findMany({
            where: {
                following_id: { in: posts.map((post) => post.user_id) },
            },
        });
        const following = await prisma.follow.findMany({
            where: {
                user_id: { in: posts.map((post) => post.user_id) },
            },
        });
        res.status(200).json({ posts, comments, following, followers });
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
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    let isRunning = false;
    const sendData = async () => {
        if (isRunning)
            return;
        isRunning = true;
        try {
            const posts = await prisma.post.findMany({
                where: { reply_to: null },
                take: 5,
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
            if (posts.length > 0) {
                res.write(`data: ${JSON.stringify(posts)}\n\n`);
            }
        }
        catch (error) {
            console.error("Error in SSE stream:", error);
            res.write(`event: error\ndata: ${JSON.stringify({ error: "Something went wrong" })}\n\n`);
        }
        finally {
            isRunning = false;
        }
    };
    await sendData();
    const stream = setInterval(async () => {
        await sendData();
    }, 10000);
    req.on("close", () => {
        clearInterval(stream);
    });
};
const likePost = async (req, res) => {
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
        let { postId } = req.params;
        let chain = [];
        while (postId) {
            const post = await prisma.post.findUnique({
                where: { id: postId },
                include: {
                    user: {
                        select: {
                            id: true,
                            displayname: true,
                            profilePicture: true,
                            username: true,
                        },
                    },
                    Like: { select: { user_id: true, post_id: true } },
                },
            });
            if (post) {
                chain.unshift(post);
                postId = post?.reply_to ?? "";
            }
        }
        const comments = await prisma.post.findMany({
            where: {
                reply_to: { in: chain.map((post) => post.id) },
            },
        });
        res.status(200).json({ chain, comments });
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
        const result = await prisma.post.create({
            data: { reply_to: postId, user_id: id, text: comment },
        });
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
const getComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await prisma.post.findMany({
            orderBy: { created_at: "desc" },
            where: { reply_to: postId },
            include: {
                user: {
                    select: {
                        id: true,
                        displayname: true,
                        profilePicture: true,
                        username: true,
                    },
                },
                Like: { select: { user_id: true, post_id: true } },
            },
        });
        const comments = await prisma.post.findMany({
            where: {
                reply_to: { in: post.map((post) => post.id) },
            },
        });
        res.status(200).json({ post, comments });
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
const repost = async (req, res) => {
    try {
        const { postId, id } = req.body;
        const result = await prisma.repost.create({
            data: { post_id: postId, user_id: id },
        });
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
const getReply = async (req, res) => {
    try {
        const { username } = req.params;
        const id = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });
        const result = await prisma.post.findMany({
            where: { user_id: id?.id, reply_to: { not: null } },
            include: {
                user: {
                    select: {
                        id: true,
                        displayname: true,
                        profilePicture: true,
                        username: true,
                    },
                },
                Like: { select: { user_id: true, post_id: true } },
            },
        });
        const chains = await Promise.all(result.map(async (post) => {
            const comment = post.reply_to
                ? await prisma.post.findUnique({
                    where: { id: post.reply_to },
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayname: true,
                                profilePicture: true,
                                username: true,
                            },
                        },
                        Like: { select: { user_id: true, post_id: true } },
                    },
                })
                : null;
            return { comment: comment, chain: { ...comment, post } };
        }));
        const filter = chains.filter((chain) => chain.comment !== null &&
            chain.chain.user_id !== chain.chain.post.user_id);
        const comments = filter.map((chain) => chain.chain);
        const checkedIds = new Set();
        const commentsList = await Promise.all(comments.map(async (comment) => {
            const promises = [];
            if (comment.id && !checkedIds.has(comment.id)) {
                checkedIds.add(comment.id);
                promises.push(prisma.post.findMany({
                    where: { reply_to: comment.id },
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayname: true,
                                profilePicture: true,
                                username: true,
                            },
                        },
                        Like: { select: { user_id: true, post_id: true } },
                    },
                }));
            }
            if (!checkedIds.has(comment.post.id)) {
                checkedIds.add(comment.post.id);
                promises.push(prisma.post.findMany({
                    where: { reply_to: comment.post.id },
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayname: true,
                                profilePicture: true,
                                username: true,
                            },
                        },
                        Like: { select: { user_id: true, post_id: true } },
                    },
                }));
            }
            const results = await Promise.all(promises);
            return results.flat();
        }));
        const flatComments = commentsList.flat();
        res.status(200).json({ comments, flatComments });
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
const followList = async (req, res) => {
    try {
        const { user, followType } = req.params;
        const checkId = await prisma.user.findUnique({
            where: { username: user },
            select: { id: true, username: true, displayname: true },
        });
        const id = checkId?.id;
        if (followType === "following") {
            const result = await prisma.follow.findMany({
                where: { user_id: id },
                include: {
                    following: {
                        select: {
                            id: true,
                            displayname: true,
                            profilePicture: true,
                            bio: true,
                            username: true,
                        },
                    },
                },
            });
            res.status(200).json({ checkId, result });
            return;
        }
        if (followType === "followers") {
            const result = await prisma.follow.findMany({
                where: { following_id: id },
                include: {
                    user: {
                        select: {
                            id: true,
                            displayname: true,
                            profilePicture: true,
                            bio: true,
                            username: true,
                        },
                    },
                },
            });
            res.status(200).json({ checkId, result });
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
const getFollow = async (req, res) => {
    try {
        const { id } = req.params;
        const follower = await prisma.follow.findMany({
            where: { following_id: id },
        });
        const following = await prisma.follow.findMany({
            where: { user_id: id },
        });
        res.status(200).json({ follower, following });
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
const getUserFollowing = async (req, res) => {
    try {
        const { userId } = req.params;
        const following = await prisma.follow.findMany({
            where: { user_id: userId },
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        displayname: true,
                        profilePicture: true
                    }
                }
            }
        });
        res.json(following);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch following' });
    }
};
const getUserFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const followers = await prisma.follow.findMany({
            where: { following_id: userId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayname: true,
                        profilePicture: true
                    }
                }
            }
        });
        res.json(followers);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch followers' });
    }
};
const getFollowPosts = async (req, res) => {
    try {
        const { id } = req.body;
        const check = await prisma.follow.findMany({ where: { user_id: id } });
        const postId = check.map((post) => post.following_id);
        const posts = await prisma.post.findMany({
            where: { reply_to: null, user_id: { in: postId } },
            orderBy: { created_at: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        displayname: true,
                        profilePicture: true,
                        username: true,
                        bio: true,
                        website: true,
                        banner: true,
                        createAt: true,
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
        const followers = await prisma.follow.findMany({
            where: {
                following_id: { in: posts.map((post) => post.user_id) },
            },
        });
        const following = await prisma.follow.findMany({
            where: {
                user_id: { in: posts.map((post) => post.user_id) },
            },
        });
        res.status(200).json({ posts, comments, following, followers });
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
const reportPost = async (req, res) => {
    try {
        const { postId, id, text } = req.body;
        const check = await prisma.report.findFirst({ where: { user_id: id } });
        if (check) {
            const checkId = check.id;
            await prisma.report.update({
                where: { id: checkId },
                data: { reason: text }
            });
        }
        else {
            await prisma.report.create({
                data: { user_id: id, report_id: postId, reason: text }
            });
        }
        res.status(200).json({ message: "Reported" });
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
export { getFollowPosts, reportPost, getUserFollowing, getUserFollowers, createPost, getFollow, followList, getProfilePost, deletePost, getAllPosts, streamPost, getReply, likePost, detailPost, upComment, getComment, getProfileReply, repost, };
