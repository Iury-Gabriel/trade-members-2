const prisma = require('../lib/prisma');

const trackView = async (req, res) => {
  try {
    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'slug é obrigatório' });
    }

    await prisma.lessonView.create({
      data: { user_id: req.userId, slug },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Erro ao rastrear visualização:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

module.exports = { trackView };
