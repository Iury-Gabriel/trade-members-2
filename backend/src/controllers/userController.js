const prisma = require('../lib/prisma');

const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { criado_em: 'desc' },
      select: {
        id: true,
        email: true,
        telefone: true,
        trader_id: true,
        ja_registrado: true,
        ja_pagou: true,
        criado_em: true,
      },
    });

    return res.json({ success: true, users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        telefone: true,
        trader_id: true,
        ja_registrado: true,
        ja_pagou: true,
        criado_em: true,
        atualizado_em: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { telefone, trader_id, ja_registrado, ja_pagou } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(telefone !== undefined && { telefone }),
        ...(trader_id !== undefined && { trader_id }),
        ...(ja_registrado !== undefined && { ja_registrado }),
        ...(ja_pagou !== undefined && { ja_pagou }),
      },
    });

    return res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        telefone: user.telefone,
        trader_id: user.trader_id,
        ja_registrado: user.ja_registrado,
        ja_pagou: user.ja_pagou,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    return res.json({ success: true, message: 'Usuário removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

module.exports = { listUsers, getUser, updateUser, deleteUser };
