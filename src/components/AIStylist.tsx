import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User2, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ChatMessage } from '@/types';
import { apiFetch } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

type SuggestionProduct = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  price: number;
  salePrice?: number | null;
  description: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Chào bạn! Tôi là stylist AI của shop. Bạn cứ nói nhu cầu như “đi làm”, “đi chơi”, “tone màu đen”, “ngân sách dưới 700k”, tôi sẽ gợi ý đẹp hơn và kèm thẻ sản phẩm để bấm xem ngay.',
    created_at: new Date().toISOString(),
  },
];

const quickReplies = [
  'Gợi ý outfit đi làm thanh lịch',
  'Tôi thích váy nữ tính dưới 800k',
  'Set đồ đi tiệc màu đen',
  'Tôi cần áo khoác dễ phối đồ',
];

function extractSlugs(content: string) {
  const matches = Array.from(content.matchAll(/http:\/\/localhost:8080\/product\/([a-z0-9-]+)/g));
  return [...new Set(matches.map((match) => match[1]))];
}

function cleanText(content: string) {
  return content.replace(/http:\/\/localhost:8080\/product\/[a-z0-9-]+/g, '').trim();
}

const ProductSuggestionCard = ({ product }: { product: SuggestionProduct }) => (
  <Link to={`/product/${product.slug}`} className="block rounded-2xl border bg-background overflow-hidden hover:shadow-md transition-shadow">
    <img src={product.imageUrl || 'https://placehold.co/600x750?text=San+pham'} alt={product.name} className="w-full aspect-[4/5] object-cover bg-muted" />
    <div className="p-3 space-y-1.5">
      <p className="font-medium line-clamp-2">{product.name}</p>
      <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
      <p className="text-sm font-semibold text-primary">{formatCurrency(product.salePrice || product.price)}</p>
    </div>
  </Link>
);

const AIStylist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [products, setProducts] = useState<SuggestionProduct[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<SuggestionProduct[]>('/products').then(setProducts).catch(() => setProducts([]));
  }, []);

  const canShowQuickReplies = useMemo(() => messages.length <= 2, [messages.length]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await apiFetch<{ reply: string }>('/chatbot', { method: 'POST', body: JSON.stringify({ message: content }) });
      const aiMsg: ChatMessage = { id: `a-${Date.now()}`, role: 'assistant', content: data.reply, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, role: 'assistant', content: 'Mình chưa kết nối được chatbot backend. Bạn hãy kiểm tra server và OPENAI_API_KEY, hoặc thử lại sau.', created_at: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await sendMessage(input); };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ duration: 0.2 }} className="mb-4 w-[420px] max-w-[calc(100vw-24px)] h-[600px] rounded-[28px] border border-border/60 bg-background/95 backdrop-blur shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-foreground to-foreground/85 text-background flex justify-between items-center">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-background/10 flex items-center justify-center"><Sparkles className="w-5 h-5" /></div><div><p className="font-semibold text-sm">Tư vấn viên AI</p><p className="text-xs text-background/70">Gợi ý đẹp hơn, đúng nhu cầu hơn</p></div></div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-background/10 rounded-xl p-2"><X className="w-4 h-4" /></button>
            </div>

            <div className="px-4 pt-3"><div className="rounded-2xl bg-primary/8 border border-primary/10 p-3 text-xs text-muted-foreground flex items-start gap-2"><Wand2 className="w-4 h-4 text-primary mt-0.5" />Hãy mô tả dịp mặc, màu bạn thích, ngân sách hoặc kiểu dáng. Khi chatbot gợi ý sản phẩm, hệ thống sẽ hiện dạng thẻ để bạn bấm vào xem ngay.</div></div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const slugs = extractSlugs(msg.content);
                const suggestionProducts = slugs.map((slug) => products.find((item) => item.slug === slug)).filter(Boolean) as SuggestionProduct[];
                return (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-primary" /></div>}
                    <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${msg.role === 'user' ? 'bg-foreground text-background rounded-br-md' : 'bg-muted text-foreground rounded-bl-md border'}`}>
                      <div className="whitespace-pre-line">{msg.role === 'assistant' ? cleanText(msg.content) : msg.content}</div>
                      {!!suggestionProducts.length && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          {suggestionProducts.map((product) => <ProductSuggestionCard key={product.id} product={product} />)}
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0"><User2 className="w-4 h-4" /></div>}
                  </div>
                );
              })}
              {loading && <div className="flex gap-2"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-primary" /></div><div className="rounded-2xl rounded-bl-md border bg-muted px-4 py-3 text-sm text-muted-foreground">Đang gợi ý sản phẩm phù hợp cho bạn...</div></div>}
            </div>

            {canShowQuickReplies && <div className="px-4 pb-2 flex flex-wrap gap-2">{quickReplies.map(reply => <button key={reply} onClick={() => sendMessage(reply)} className="text-xs bg-muted hover:bg-accent px-3 py-2 rounded-full transition-colors border">{reply}</button>)}</div>}

            <form onSubmit={handleSubmit} className="p-3 border-t bg-background/90 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ví dụ: váy đi tiệc màu đen dưới 1 triệu" className="flex-1 text-sm bg-muted border border-transparent rounded-full px-4 py-3 outline-none focus:ring-2 ring-primary/20" />
              <button type="submit" disabled={loading} className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"><Send className="w-4 h-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(!isOpen)} className="bg-foreground text-background p-4 rounded-full shadow-elevated hover:shadow-soft transition-shadow relative">
        <MessageSquare className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
      </motion.button>
    </div>
  );
};

export default AIStylist;
