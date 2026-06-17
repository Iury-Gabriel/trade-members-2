const prisma = require('../lib/prisma');

const registro = async (req, res) => {
  try {
    const { trader_id, postback_name } = req.query;

    if (!trader_id) {
      return res.status(400).json({ success: false, message: 'trader_id é obrigatório' });
    }

    await prisma.postback.create({
      data: {
        trader_id: String(trader_id),
        postback_name: postback_name || 'Registro',
      },
    });

    return res.json({ success: true, message: 'Postback de registro recebido' });
  } catch (error) {
    console.error('Erro no webhook de registro:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const ftd = async (req, res) => {
  try {
    const { trader_id, amount } = req.query;

    if (!trader_id) {
      return res.status(400).json({ success: false, message: 'trader_id é obrigatório' });
    }

    const traderId = String(trader_id);

    await prisma.postback.create({
      data: {
        trader_id: traderId,
        postback_name: 'FTD',
        amount: amount ? parseFloat(amount) : null,
      },
    });

    const user = await prisma.user.findFirst({
      where: { trader_id: traderId },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { ja_pagou: true },
      });
    }

    return res.json({ success: true, message: 'Postback de FTD recebido' });
  } catch (error) {
    console.error('Erro no webhook de FTD:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const ativar = async (req, res) => {
  try {
    const { trader_id } = req.body;

    if (!trader_id) {
      return res.status(400).json({ success: false, message: 'trader_id é obrigatório' });
    }

    const traderId = String(trader_id);

    const postback = await prisma.postback.findFirst({
      where: { trader_id: traderId, postback_name: { not: 'FTD' } },
    });

    if (!postback) {
      return res.status(404).json({
        success: false,
        message: 'ID não encontrado. Verifique se você criou a conta na CasaTrade com este ID.',
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { trader_id: traderId },
    });

    if (existingUser && existingUser.id !== req.userId) {
      return res.status(409).json({
        success: false,
        message: 'Este ID já está vinculado a outra conta.',
      });
    }

    const ftdPostback = await prisma.postback.findFirst({
      where: { trader_id: traderId, postback_name: 'FTD' },
    });

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        trader_id: traderId,
        ja_registrado: true,
        ja_pagou: !!ftdPostback,
      },
    });

    return res.json({
      success: true,
      message: 'Licença ativada com sucesso!',
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
    console.error('Erro ao ativar licença:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

const kirvano = async (req, res) => {
  try {
    const body = req.body;

    if (!body || body.event !== 'SALE_APPROVED') {
      return res.json({ success: true, message: 'Evento ignorado' });
    }

    const email = body.customer?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email do cliente não encontrado' });
    }

    const emailLower = email.toLowerCase().trim();

    let user = await prisma.user.findUnique({ where: { email: emailLower } });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { ja_registrado: true, ja_pagou: true },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: emailLower,
          ja_registrado: true,
          ja_pagou: true,
        },
      });
    }

    const totalPrice = body.total_price
      ? parseFloat(body.total_price.replace('R$', '').replace('.', '').replace(',', '.').trim())
      : null;

    await prisma.postback.create({
      data: {
        trader_id: body.sale_id || 'kirvano',
        postback_name: 'FTD',
        amount: totalPrice,
      },
    });

    console.log(`[Kirvano] Compra aprovada - ${emailLower} - R$ ${totalPrice}`);

    return res.json({ success: true, message: 'Compra processada com sucesso' });
  } catch (error) {
    console.error('Erro no webhook Kirvano:', error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};

module.exports = { registro, ftd, ativar, kirvano };
