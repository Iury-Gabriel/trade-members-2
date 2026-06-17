const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const FTD_DEFAULT_VALUE = 60;
const COMMISSION_RATE = 0.70;

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user || !user.is_admin || !user.password) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({ success: true, token });
  } catch (error) {
    console.error('Erro no login admin:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const dashboard = async (req, res) => {
  try {
    const { from, to } = req.query;

    const dateFilter = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.lte = toDate;
    }

    const hasDateFilter = Object.keys(dateFilter).length > 0;
    const where = hasDateFilter ? { criado_em: dateFilter, is_admin: false } : { is_admin: false };
    const postbackWhere = hasDateFilter ? { criado_em: dateFilter } : {};

    const [
      totalUsers,
      usersWithTraderId,
      usersWithFtd,
      totalPostbacks,
      registroPostbacks,
      ftdPostbacks,
    ] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.count({ where: { ...where, trader_id: { not: null } } }),
      prisma.user.count({ where: { ...where, ja_pagou: true } }),
      prisma.postback.count({ where: postbackWhere }),
      prisma.postback.count({ where: { ...postbackWhere, postback_name: 'Registro' } }),
      prisma.postback.count({ where: { ...postbackWhere, postback_name: 'FTD' } }),
    ]);

    const convRegistro = totalUsers > 0 ? ((usersWithTraderId / totalUsers) * 100).toFixed(1) : '0.0';
    const convFtd = usersWithTraderId > 0 ? ((usersWithFtd / usersWithTraderId) * 100).toFixed(1) : '0.0';
    const convFtdTotal = totalUsers > 0 ? ((usersWithFtd / totalUsers) * 100).toFixed(1) : '0.0';

    // Financials - sum real amounts from FTD postbacks, fallback to R$60 for old ones without amount
    const ftdPostbacksList = await prisma.postback.findMany({
      where: { ...postbackWhere, postback_name: 'FTD' },
      select: { amount: true },
    });
    const receitaBruta = ftdPostbacksList.reduce((sum, p) => sum + (p.amount || FTD_DEFAULT_VALUE), 0);
    const receitaLiquida = Math.round(receitaBruta * COMMISSION_RATE * 100) / 100;

    // Funnel
    const funnel = {
      cadastros: totalUsers,
      ativaram: usersWithTraderId,
      ftd: usersWithFtd,
      dropCadastroAtivacao: totalUsers > 0 ? ((1 - usersWithTraderId / totalUsers) * 100).toFixed(1) : '0.0',
      dropAtivacaoFtd: usersWithTraderId > 0 ? ((1 - usersWithFtd / usersWithTraderId) * 100).toFixed(1) : '0.0',
    };

    // Users per day chart
    const chartFrom = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const chartTo = to ? new Date(to) : new Date();
    chartTo.setHours(23, 59, 59, 999);

    const usersPerDay = await prisma.$queryRawUnsafe(`
      SELECT DATE(criado_em) as date, COUNT(*)::int as count
      FROM usuarios
      WHERE criado_em >= $1 AND criado_em <= $2 AND is_admin = false
      GROUP BY DATE(criado_em)
      ORDER BY date ASC
    `, chartFrom, chartTo);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        usersWithTraderId,
        usersWithFtd,
        totalPostbacks,
        registroPostbacks,
        ftdPostbacks,
        convRegistro,
        convFtd,
        convFtdTotal,
        receitaBruta,
        receitaLiquida,
        funnel,
        usersPerDay,
      },
    });
  } catch (error) {
    console.error('Erro no dashboard:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const listUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = { is_admin: false };
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { trader_id: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { criado_em: 'desc' },
        skip,
        take: Number(limit),
        select: {
          id: true,
          email: true,
          telefone: true,
          trader_id: true,
          ja_registrado: true,
          ja_pagou: true,
          last_login: true,
          login_count: true,
          criado_em: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const exportCsv = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { is_admin: false },
      orderBy: { criado_em: 'desc' },
      select: {
        email: true,
        trader_id: true,
        ja_registrado: true,
        ja_pagou: true,
        last_login: true,
        login_count: true,
        criado_em: true,
      },
    });

    const header = 'Email,Trader ID,Registrado,FTD,Último Login,Qtd Logins,Data Cadastro\n';
    const rows = users.map(u =>
      `"${u.email}","${u.trader_id || ''}",${u.ja_registrado ? 'Sim' : 'Não'},${u.ja_pagou ? 'Sim' : 'Não'},"${u.last_login ? new Date(u.last_login).toLocaleString('pt-BR') : 'Nunca'}",${u.login_count},"${new Date(u.criado_em).toLocaleString('pt-BR')}"`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.csv');
    return res.send('﻿' + header + rows);
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const webhookLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {};
    if (type) where.postback_name = type;

    const [postbacks, total] = await Promise.all([
      prisma.postback.findMany({
        where,
        orderBy: { criado_em: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.postback.count({ where }),
    ]);

    return res.json({
      success: true,
      postbacks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao listar postbacks:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const activityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, user_id } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = user_id ? { user_id } : {};

    const [views, total] = await Promise.all([
      prisma.lessonView.findMany({
        where,
        orderBy: { viewed_at: 'desc' },
        skip,
        take: Number(limit),
        include: {
          user: { select: { email: true } },
        },
      }),
      prisma.lessonView.count({ where }),
    ]);

    return res.json({
      success: true,
      views,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { ja_pagou, ja_registrado, trader_id } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(ja_pagou !== undefined && { ja_pagou }),
        ...(ja_registrado !== undefined && { ja_registrado }),
        ...(trader_id !== undefined && { trader_id }),
      },
    });

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Senha atual e nova senha são obrigatórias' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Nova senha deve ter no mínimo 8 caracteres' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user || !user.password) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Senha atual incorreta' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    return res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, ja_registrado, ja_pagou } = req.body;

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
        ja_registrado: !!ja_registrado,
        ja_pagou: !!ja_pagou,
      },
    });

    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    if (user.is_admin) {
      return res.status(403).json({ success: false, message: 'Não é possível apagar um administrador' });
    }
    await prisma.user.delete({ where: { id } });
    return res.json({ success: true, message: 'Usuário apagado com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar usuário:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

module.exports = { adminLogin, dashboard, listUsers, exportCsv, webhookLogs, activityLogs, updateUser, changePassword, createUser, deleteUser };
