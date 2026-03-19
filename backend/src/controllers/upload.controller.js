import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, '../../uploads');

const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

function sanitizeFilename(name = 'image') {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'image';
}

function resolveExtension(originalName, mimeType) {
  const extFromName = path.extname(originalName || '').toLowerCase();
  if (extFromName) return extFromName;
  return EXT_BY_MIME[mimeType] || '.bin';
}

export async function uploadImage(req, res) {
  try {
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: 'Không nhận được dữ liệu ảnh upload' });
    }

    const folder = req.query.folder === 'avatars' ? 'avatars' : 'products';
    if (folder === 'products' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Bạn không có quyền upload ảnh sản phẩm' });
    }

    const contentType = req.headers['content-type'] || 'application/octet-stream';
    const rawFilename = decodeURIComponent(String(req.headers['x-file-name'] || 'image'));
    const baseName = sanitizeFilename(path.basename(rawFilename, path.extname(rawFilename)));
    const extension = resolveExtension(rawFilename, contentType);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}${extension}`;
    const targetDir = path.join(uploadsRoot, folder);
    const targetPath = path.join(targetDir, filename);

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(targetPath, req.body);

    res.status(201).json({
      message: 'Upload ảnh thành công',
      url: `/uploads/${folder}/${filename}`,
      filename,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể upload ảnh' });
  }
}
