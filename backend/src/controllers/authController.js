const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

const register = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'E-mail é obrigatório' });
    }

    const emailLower = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: emailLower } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado' });
    }

    const user = await prisma.user.create({
      data: {
        email: emailLower,
      },
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso',
      token,
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
    console.error('Erro no registro:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'E-mail é obrigatório' });
    }

    const emailLower = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: emailLower } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'E-mail não encontrado. Crie uma conta primeiro.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date(), login_count: { increment: 1 } },
    });

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
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
    console.error('Erro no login:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    return res.json({
      success: true,
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
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

const update = async (req, res) => {
  try {
    const { telefone, trader_id } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(telefone !== undefined && { telefone }),
        ...(trader_id !== undefined && { trader_id }),
      },
    });

    return res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
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
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

module.exports = { register, login, me, update };
