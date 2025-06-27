const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para buscar todos os posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, name: true, avatar_initials: true, department: true }
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

// Função para criar um novo post
const createPost = async (req, res) => {
    try {
        const { content, type, authorId, companyId, tags } = req.body;

        if (!authorId || !companyId) {
            return res.status(400).json({ error: "authorId e companyId são obrigatórios para o teste." })
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

// Curtir ou Descurtir um post
const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params; 
        const { userId } = req.body;    

        if (!userId) {
            return res.status(400).json({ error: "userId é obrigatório." });
        }

        const likeId = {
            userId: parseInt(userId),
            postId: parseInt(postId)
        };

        const existingLike = await prisma.postLike.findUnique({
            where: { userId_postId: likeId }
        });

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

// Criar um comentário
const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, authorId } = req.body;

        if (!content || !authorId) {
            return res.status(400).json({ error: "content e authorId são obrigatórios." });
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

// Buscar comentários de um post
const getCommentsForPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await prisma.comment.findMany({
            where: {
                postId: parseInt(postId)
            },
            orderBy: {
                createdAt: 'asc' 
            },
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