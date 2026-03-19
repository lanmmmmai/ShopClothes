import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.gmailUser,
    pass: env.gmailAppPassword,
  },
});

function ensureMailConfig() {
  if (!env.gmailUser || !env.gmailAppPassword) {
    throw new Error('Thiếu cấu hình Gmail. Hãy thêm GMAIL_USER và GMAIL_APP_PASSWORD vào file .env');
  }
}

function wrapMailTemplate({ eyebrow, title, subtitle, body, accent = '#d63b64' }) {
  return `
    <div style="margin:0;padding:32px 12px;background:#f6f1f3;font-family:'Segoe UI',Arial,sans-serif;color:#161616;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 16px 40px rgba(28,28,28,.08);border:1px solid rgba(0,0,0,.04)">
        <div style="padding:28px 32px;background:linear-gradient(135deg, rgba(214,59,100,.12), rgba(255,242,229,.9));border-bottom:1px solid rgba(0,0,0,.05)">
          <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:#fff;color:${accent};font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">${eyebrow}</div>
          <h1 style="margin:18px 0 10px;font-size:28px;line-height:1.25;">${title}</h1>
          <p style="margin:0;font-size:15px;line-height:1.7;color:#5f5f67;">${subtitle}</p>
        </div>
        <div style="padding:28px 32px;line-height:1.75;font-size:15px;color:#2f2f35;">${body}</div>
        <div style="padding:0 32px 28px;color:#7a7a82;font-size:12px;line-height:1.7;">
          Email được gửi tự động từ hệ thống ShopClothes. Nếu bạn không thực hiện thao tác này, hãy đổi mật khẩu ngay sau khi đăng nhập và liên hệ quản trị viên.
        </div>
      </div>
    </div>
  `;
}

export async function sendOtpMail({ to, fullName, code }) {
  ensureMailConfig();
  return transporter.sendMail({
    from: `Chic Threads <${env.gmailUser}>`,
    to,
    subject: 'Mã OTP xác nhận tài khoản',
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2>Xin chào ${fullName},</h2>
      <p>Mã OTP để xác nhận tài khoản của bạn là:</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:6px">${code}</div>
      <p>Mã có hiệu lực trong 10 phút.</p>
    </div>`,
  });
}

export async function sendBillMail({ to, fullName, order }) {
  ensureMailConfig();
  const itemsHtml = order.items
    .map((item) => `<tr><td>${item.productName}</td><td>${item.quantity}</td><td>${item.unitPrice.toLocaleString('vi-VN')}₫</td></tr>`)
    .join('');

  return transporter.sendMail({
    from: `Chic Threads <${env.gmailUser}>`,
    to,
    subject: `Hóa đơn đơn hàng ${order.orderCode}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2>Cảm ơn ${fullName} đã đặt hàng</h2>
      <p>Mã đơn: <strong>${order.orderCode}</strong></p>
      <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;width:100%">
        <thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p>Phí vận chuyển: <strong>${order.shippingFee.toLocaleString('vi-VN')}₫</strong></p>
      <p>Tổng thanh toán: <strong>${order.totalAmount.toLocaleString('vi-VN')}₫</strong></p>
      <p>Trạng thái thanh toán: <strong>${order.paymentStatus}</strong></p>
    </div>`,
  });
}

export async function sendOrderPaymentOtpMail({ to, fullName, code, amount }) {
  ensureMailConfig();
  return transporter.sendMail({
    from: `Chic Threads <${env.gmailUser}>`,
    to,
    subject: 'Mã OTP xác nhận thanh toán đơn hàng',
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2>Xin chào ${fullName},</h2>
      <p>Bạn đang xác nhận thanh toán chuyển khoản cho đơn hàng trị giá <strong>${amount.toLocaleString('vi-VN')}₫</strong>.</p>
      <p>Mã OTP thanh toán của bạn là:</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:6px">${code}</div>
      <p>Mã có hiệu lực trong 10 phút. Không chia sẻ mã này cho bất kỳ ai.</p>
    </div>`,
  });
}

export async function sendTemporaryPasswordMail({ to, fullName, temporaryPassword }) {
  ensureMailConfig();
  const html = wrapMailTemplate({
    eyebrow: 'Khôi phục mật khẩu',
    title: `Xin chào ${fullName}, mật khẩu tạm thời của bạn đã sẵn sàng`,
    subtitle: 'Hệ thống vừa tạo một mật khẩu mới để bạn đăng nhập lại vào ShopClothes. Vì lý do bảo mật, bạn sẽ phải đổi mật khẩu ngay sau khi vào hệ thống.',
    body: `
      <p style="margin:0 0 16px;">Hãy dùng mật khẩu dưới đây để đăng nhập:</p>
      <div style="margin:0 0 20px;padding:18px 20px;border-radius:22px;background:#fff4f7;border:1px dashed rgba(214,59,100,.45);text-align:center;">
        <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#9a4a62;font-weight:700;margin-bottom:8px;">Mật khẩu tạm thời</div>
        <div style="font-size:28px;font-weight:800;letter-spacing:.12em;color:#1d1d22;word-break:break-word;">${temporaryPassword}</div>
      </div>
      <div style="padding:18px 20px;border-radius:20px;background:#faf7ef;color:#5f5430;margin-bottom:18px;">
        <strong>Lưu ý:</strong> Sau khi đăng nhập, bạn chỉ có thể truy cập trang đổi mật khẩu cho tới khi tạo mật khẩu mới thành công.
      </div>
      <ol style="padding-left:18px;margin:0;">
        <li>Đăng nhập bằng email và mật khẩu tạm thời ở trên.</li>
        <li>Đổi sang mật khẩu riêng của bạn ngay tại màn hình bắt buộc đổi mật khẩu.</li>
        <li>Không chia sẻ mật khẩu này cho người khác.</li>
      </ol>
    `,
  });

  return transporter.sendMail({
    from: `Chic Threads <${env.gmailUser}>`,
    to,
    subject: 'Mật khẩu mới cho tài khoản ShopClothes',
    html,
  });
}
