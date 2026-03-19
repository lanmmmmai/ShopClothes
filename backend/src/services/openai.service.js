import OpenAI from 'openai';
import { env } from '../config/env.js';

const client = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

function normalize(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function buildProductPrompt(products = []) {
  if (!products.length) return 'Hiện chưa có dữ liệu sản phẩm.';
  return products
    .slice(0, 12)
    .map((product, index) => {
      const price = product.salePrice || product.price;
      return `${index + 1}. ${product.name} | giá ${price}đ | danh mục ${product.category?.name || ''} | mô tả: ${product.description} | link: http://localhost:8080/product/${product.slug}`;
    })
    .join('\n');
}

function localSuggest(message, products = []) {
  const q = normalize(message);
  const scored = products
    .map((product) => {
      const haystack = normalize(`${product.name} ${product.description} ${product.category?.name || ''}`);
      let score = 0;

      if (q.includes('di lam') || q.includes('cong so')) {
        if (/so mi|blazer|au|chan vay|cardigan|polo/.test(haystack)) score += 8;
      }
      if (q.includes('di tiec')) {
        if (/dam|tiec|blazer|tui/.test(haystack)) score += 8;
      }
      if (q.includes('ao khoac')) {
        if (/ao khoac|blazer|cardigan/.test(haystack)) score += 9;
      }
      if (q.includes('vay') || q.includes('dam')) {
        if (/vay|dam|maxi/.test(haystack)) score += 7;
      }
      if (q.includes('jean')) {
        if (/jean|thun|khoac/.test(haystack)) score += 6;
      }

      ['den', 'trang', 'hong', 'xanh', 'be', 'kem', 'nau', 'do'].forEach((color) => {
        if (q.includes(color) && haystack.includes(color)) score += 3;
      });

      const priceMatch = q.match(/(\d+[\.,]?\d*)\s*(k|nghin|trieu|m)/);
      if (priceMatch) {
        const raw = Number(priceMatch[1].replace(',', '.'));
        const unit = priceMatch[2];
        const budget = unit === 'trieu' || unit === 'm' ? raw * 1000000 : raw * 1000;
        if ((product.salePrice || product.price) <= budget) score += 4;
      }

      if (haystack.includes(q)) score += 10;
      score += (product.sold_count || 0) / 100;
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((item) => item.score > 0);

  if (!scored.length) {
    return [
      'Mình đã hiểu nhu cầu của bạn nhưng hiện chưa tìm được mẫu thật sát.',
      'Bạn có thể xem nhanh toàn bộ sản phẩm tại:',
      'http://localhost:8080/products',
      '',
      'Bạn hãy nói thêm màu sắc, dịp mặc hoặc ngân sách để mình lọc chuẩn hơn.',
    ].join('\n');
  }

  const intro = q.includes('di lam') || q.includes('cong so')
    ? 'Mình gợi ý vài mẫu hợp đi làm, dễ phối và thanh lịch:'
    : q.includes('di tiec')
      ? 'Đây là vài mẫu hợp đi tiệc, lên dáng nổi bật:'
      : 'Mình chọn cho bạn vài mẫu khá hợp với nhu cầu vừa mô tả:';

  const suggestions = scored
    .map(({ product }) => {
      const price = (product.salePrice || product.price).toLocaleString('vi-VN');
      return [
        `- ${product.name}: ${product.description}`,
        `  Giá tham khảo: ${price}đ`,
        `  Xem sản phẩm: http://localhost:8080/product/${product.slug}`,
      ].join('\n');
    })
    .join('\n');

  return [
    intro,
    suggestions,
    '',
    'Nếu muốn, bạn nhắn tiếp kiểu như: “tôi thích tone đen”, “dưới 700k”, “dáng che khuyết điểm”, mình sẽ lọc sát hơn.',
  ].join('\n');
}

export async function askStylist(messages, products = []) {
  const systemContent = `Bạn là chatbot tư vấn thời trang cho website bán hàng.
- Luôn trả lời bằng tiếng Việt tự nhiên, thân thiện, thuyết phục hơn.
- Hỏi ít, gợi ý cụ thể nhiều.
- Khi giới thiệu sản phẩm, hãy nêu lý do phù hợp với nhu cầu khách.
- Nếu có sản phẩm phù hợp, phải chèn link đầy đủ dạng http://localhost:8080/product/slug để người dùng bấm vào.
- Ưu tiên câu trả lời đẹp mắt: chia đoạn ngắn, có bullet khi cần, không quá dài.
- Chỉ giới thiệu các sản phẩm nằm trong danh sách sau:
${buildProductPrompt(products)}`;

  if (!client) {
    const lastUserMessage = [...messages].reverse().find((item) => item.role === 'user')?.content || '';
    return localSuggest(lastUserMessage, products);
  }

  const response = await client.chat.completions.create({
    model: env.openAiModel,
    messages: [
      { role: 'system', content: systemContent },
      ...messages,
    ],
    temperature: 0.85,
  });

  return response.choices[0]?.message?.content || localSuggest(messages[messages.length - 1]?.content || '', products);
}
