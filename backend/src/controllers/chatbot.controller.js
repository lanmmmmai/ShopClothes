import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { askStylist } from '../services/openai.service.js';

export async function askChatbot(req, res) {
  try {
    const schema = z.object({ message: z.string().min(1) });
    const { message } = schema.parse(req.body);

    if (req.user) {
      await prisma.chatMessage.create({ data: { role: 'user', content: message, userId: req.user.id } });
    }

    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: [{ stock: 'desc' }, { createdAt: 'desc' }],
      take: 20,
    });

    const answer = await askStylist([{ role: 'user', content: message }], products);

    if (req.user) {
      await prisma.chatMessage.create({ data: { role: 'assistant', content: answer, userId: req.user.id } });
    }

    res.json({ reply: answer });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể gọi chatbot' });
  }
}
