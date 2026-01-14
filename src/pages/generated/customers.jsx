import React, { useState, useEffect } from 'react';
import { Layout, Button, Table } from '../../components/layout';
import { nocodb } from '../../services/nocodb';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load customers from NocoDB
  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError(null);
      // NocoDB API: GET /customers returns { list: [...], pageInfo: {...} }
      const response = await nocodb.get('/customers');
      const data = response.data;
      // NocoDB returns data in { list: [...] } format
      setCustomers(data.list || data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError(err.response?.data?.error || 'Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa khách hàng này?')) return;

    try {
      await nocodb.delete(`/customers/${id}`);
      // Reload list after delete
      await loadCustomers();
    } catch (err) {
      console.error('Failed to delete customer:', err);
      alert('Không thể xóa khách hàng');
    }
  }

  function handleImport() {
    alert('Tính năng nhập dữ liệu sẽ được triển khai sau');
  }

  function handleAdd() {
    alert('Tính năng thêm khách hàng sẽ được triển khai sau');
  }

  // Table columns configuration
  const columns = [
    { label: 'Tên', className: 'flex flex-1 items-start gap-0.5', sortable: true },
    { label: 'Email', className: 'flex flex-1 items-start gap-1', sortable: true },
    { label: 'Phone', className: 'flex shrink-0 items-start', sortable: true },
    { label: 'Giới tính', className: 'flex shrink-0 items-start gap-[3px]', sortable: false },
    { label: '', className: 'w-10 h-6' }, // Actions column
  ];

  // Render table row
  function renderRow(customer, idx) {
    const customerId = customer.Id || customer.id;
    const name = customer.name || customer.Name || customer.username || 'N/A';
    const email = customer.email || customer.Email || 'N/A';
    const phone = customer.phone || customer.Phone || customer.phoneNumber || 'N/A';
    const gender = customer.gender || customer.Gender || customer.gioiTinh || 'N/A';
    const avatar = customer.avatar || customer.Avatar || 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/bpupbfl5_expires_30_days.png';

	return (
      <div key={customerId || idx} className="flex items-start self-stretch px-5">
										<div className="flex flex-1 items-center gap-1.5">
          <img src={avatar} className="w-[50px] h-[50px] object-fill rounded-full" alt={name} />
          <span className="text-black text-sm">{name}</span>
										</div>
										<div className="flex flex-1 flex-col items-start py-3.5">
          <span className="text-black text-sm">{email}</span>
										</div>
										<div className="flex flex-col shrink-0 items-start py-3.5 pr-[33px]">
          <span className="text-black text-sm">{phone}</span>
										</div>
										<div className="flex flex-col shrink-0 items-start py-3.5 pl-2.5 pr-12">
          <span className="text-black text-sm">{gender}</span>
										</div>
        <div className="flex items-center py-3.5">
          <button
            onClick={() => handleDelete(customerId)}
            className="text-red-600 hover:text-red-800 text-sm"
            title="Xóa"
          >
            🗑️
          </button>
									</div>
								</div>
    );
  }

  // Actions buttons
  const actions = (
    <>
      <Button variant="secondary" onClick={handleImport}>
        Nhập
      </Button>
      <Button variant="primary" onClick={handleAdd}>
        Thêm khách hàng
      </Button>
    </>
  );

  return (
    <Layout title="Khách hàng" actions={actions}>
      <div className="flex items-start self-stretch w-full">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="text-gray-500">Đang tải...</div>
							</div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="text-red-600">
              <p>{error}</p>
              <Button variant="primary" onClick={loadCustomers} className="mt-4">
                Thử lại
              </Button>
									</div>
								</div>
        ) : customers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="text-gray-500">
              <p>Chưa có khách hàng nào</p>
              <Button variant="primary" onClick={handleAdd} className="mt-4">
                Thêm khách hàng đầu tiên
              </Button>
										</div>
									</div>
        ) : (
          <Table columns={columns} data={customers} renderRow={renderRow} />
        )}
								</div>
    </Layout>
  );
}
