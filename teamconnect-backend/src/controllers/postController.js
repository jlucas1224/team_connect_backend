const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCompanyIdFromHeader = (req) => {
    return parseInt(req.headers['x-company-id']);
};

const getAllPosts = async (req, res) => {
    const companyId = getCompanyIdFromHeader(req);
    if (!companyId) return res.status(400).json({ error: "Header 'x-company-id' é obrigatório." });

    try {
        const posts = await prisma.post.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, name: true, avatar_initials: true, department: { select: { name: true } } }
                },
                tags: { select: { name: true } },
                _count: {
                    select: { likes: true, comments: true }
                }
            }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar posts', details: error.message });
    }
};

const createPost = async (req, res) => {
    const companyId = getCompanyIdFromHeader(req);
    if (!companyId) return res.status(400).json({ error: "Header 'x-company-id' é obrigatório." });

    const { content, type, authorId, tags } = req.body;

    try {
        const author = await prisma.user.findFirst({ where: { id: authorId, companyId } });
        if (!author) {
            return res.status(403).json({ error: "O autor do post não pertence a esta empresa." });
        }

        const newPost = await prisma.post.create({
            data: {
                content,
                type,
                authorId,
                companyId,
                tags: tags ? {
                    connectOrCreate: tags.map(tag => ({
                        where: { companyId_name: { companyId, name: tag } },
                        create: { name: tag, companyId },
                    }))
                } : undefined
            }
        });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar post', details: error.message });
    }
};

const toggleLike = async (req, res) => {
    const companyId = getCompanyIdFromHeader(req);
    if (!companyId) return res.status(400).json({ error: "Header 'x-company-id' é obrigatório." });

    try {
        const { postId } = req.params;
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "userId é obrigatório." });

        const post = await prisma.post.findFirst({
            where: { id: parseInt(postId), companyId }
        });

        if (!post) {
            return res.status(404).json({ error: "Post não encontrado nesta empresa." });
        }

        const likeId = { userId: parseInt(userId), postId: parseInt(postId) };
        const existingLike = await prisma.postLike.findUnique({ where: { userId_postId: likeId } });

        if (existingLike) {
            await prisma.postLike.delete({ where: { userId_postId: likeId } });
            res.status(200).json({ message: "Post descurtido." });
        } else {
            await prisma.postLike.create({ data: likeId });
            res.status(201).json({ message: "Post curtido." });
        }

    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar o like', details: error.message });
    }
};

const createComment = async (req, res) => {
    const companyId = getCompanyIdFromHeader(req);
    if (!companyId) return res.status(400).json({ error: "Header 'x-company-id' é obrigatório." });

    try {
        const { postId } = req.params;
        const { content, authorId } = req.body;
        if (!content || !authorId) return res.status(400).json({ error: "content e authorId são obrigatórios." });
        
        const post = await prisma.post.findFirst({
            where: { id: parseInt(postId), companyId }
        });

        if (!post) {
            return res.status(404).json({ error: "Post não encontrado nesta empresa." });
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                authorId: parseInt(authorId),
                postId: parseInt(postId)
            }
        });

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar comentário', details: error.message });
    }
};

const getCommentsForPost = async (req, res) => {
    const companyId = getCompanyIdFromHeader(req);
    if (!companyId) return res.status(400).json({ error: "Header 'x-company-id' é obrigatório." });

    try {
        const { postId } = req.params;

        const comments = await prisma.comment.findMany({
            where: {
                post: {
                    id: parseInt(postId),
                    companyId: companyId
                }
            },
            orderBy: { createdAt: 'asc' },
            include: {
                author: {
                    select: { id: true, name: true, avatar_initials: true }
                }
            }
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar comentários', details: error.message });
    }
}


module.exports = {
    getAllPosts,
    createPost,
    toggleLike,
    createComment,
    getCommentsForPost
}