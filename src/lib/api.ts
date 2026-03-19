const RAW_API_URL = import.meta.env.VITE_API_URL?.trim() || '/api';
const API_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function buildHeaders(options: RequestInit) {
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const isBinaryBody = options.body instanceof Blob || options.body instanceof ArrayBuffer || ArrayBuffer.isView(options.body as ArrayBufferView);

  if (!isFormData && !isBinaryBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('access_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_URL}${normalizedPath}`, {
    ...options,
    headers: buildHeaders(options),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || 'API error', response.status, data.code);
  }
  return data as T;
}

export async function uploadImage(file: File, folder: 'products' | 'avatars') {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_URL}/uploads/image?folder=${folder}`, {
    method: 'POST',
    body: file,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': file.type || 'application/octet-stream',
      'X-File-Name': encodeURIComponent(file.name),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || 'Upload thất bại', response.status, data.code);
  }
  return data as { message: string; url: string; filename: string };
}
