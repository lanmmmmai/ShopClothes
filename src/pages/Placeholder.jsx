import React from 'react'
import { Link } from 'react-router-dom'

export default function Placeholder({ title }) {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-black">{title}</h1>
        <p className="text-neutral-600 mt-2">
          File giao diện của trang này trong bản zip bạn gửi đang bị rỗng (0 byte), nên mình tạo trang tạm để project chạy được trên localhost.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="px-4 py-2 rounded-lg bg-black text-white" to="/customers">Khách hàng</Link>
          <Link className="px-4 py-2 rounded-lg bg-black text-white" to="/report">Báo cáo</Link>
          <Link className="px-4 py-2 rounded-lg bg-black text-white" to="/schedule">Lịch trình</Link>
          <Link className="px-4 py-2 rounded-lg bg-black text-white" to="/settings">Cài đặt</Link>
        </div>
      </div>
    </div>
  )
}
