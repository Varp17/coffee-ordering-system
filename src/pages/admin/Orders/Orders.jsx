import React, { useState, useEffect, useMemo } from 'react';
import './Orders.css';
import Button from '../../../components/Button/Button';
import { useOrderStore } from '../../../store/useOrderStore';
import { formatCurrency } from '../../../utils/formatters';
import toast from 'react-hot-toast';

const Orders = () => {
  const { orders: ordersList, fetchOrders, updateOrderStatus, refundOrder, isLoading } = useOrderStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const statusOptions = ['all', 'pending', 'in_progress', 'ready', 'completed', 'cancelled', 'refunded'];
  const sourceOptions = ['all', 'd2c_website', 'kiosk'];

  const filteredOrders = useMemo(() => {
    return ordersList.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesSource = sourceFilter === 'all' || order.channel?.toLowerCase() === sourceFilter.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        (order.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer_name || 'Guest').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer_email || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSource && matchesSearch;
    });
  }, [ordersList, statusFilter, sourceFilter, searchQuery]);

  const handleStatusChange = async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      toast.success(`Order status updated to "${newStatus}"`, { icon: '📦' });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } else {
      toast.error(`Failed to update status: ${res.error}`);
    }
  };

  const handleRefund = async (orderId) => {
    const res = await refundOrder(orderId);
    if (res.success) {
      toast.success(`Refund initiated for ${orderId}.`, { icon: '💰' });
      setShowRefundModal(false);
      setShowDetailModal(false);
    } else {
      toast.error(`Refund failed: ${res.error}`);
    }
  };

  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'status-pending',
      'in_progress': 'status-progress',
      'ready': 'status-ready',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled',
      'refunded': 'status-refunded',
    };
    return colors[status?.toLowerCase()] || '';
  };

  const getNextStatus = (current) => {
    const flow = { 'pending': 'in_progress', 'in_progress': 'ready', 'ready': 'completed' };
    return flow[current?.toLowerCase()] || null;
  };

  const orderStats = useMemo(() => ({
    total: ordersList.length,
    pending: ordersList.filter(o => o.status === 'pending').length,
    inProgress: ordersList.filter(o => o.status === 'in_progress').length,
    completed: ordersList.filter(o => o.status === 'completed').length,
    totalRevenue: ordersList.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0),
  }), [ordersList]);

  if (isLoading && ordersList.length === 0) {
    return (
      <div className="orders-view flex-center" style={{ height: '70vh' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-view animate-fade-in">
      {/* Stats Summary Row */}
      <div className="orders-stats-row">
        <div className="order-stat-card">
          <span className="stat-icon">📋</span>
          <div className="stat-info">
            <span className="stat-num">{orderStats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="order-stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <span className="stat-num">{orderStats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="order-stat-card">
          <span className="stat-icon">🔧</span>
          <div className="stat-info">
            <span className="stat-num">{orderStats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="order-stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-num">{orderStats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="order-stat-card">
          <span className="stat-icon">💰</span>
          <div className="stat-info">
            <span className="stat-num">{formatCurrency(orderStats.totalRevenue)}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="orders-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by Order ID, Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="orders-search-input"
          />
        </div>
        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            {statusOptions.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace('_', ' ')}</option>
            ))}
          </select>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="filter-select">
            {sourceOptions.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Sources' : s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="table orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Source</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="table-empty">
                  <div className="empty-state-inline">
                    <span className="empty-icon">📭</span>
                    <p>No orders match your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="order-row" onClick={() => openDetail(order)}>
                  <td className="order-id-cell"><strong>{order.order_number || order.id}</strong></td>
                  <td>
                    <div className="customer-cell">
                      <span className="customer-avatar">{(order.customer_name || 'G').charAt(0)}</span>
                      <div>
                        <span className="customer-name">{order.customer_name || 'Guest'}</span>
                        <span className="customer-email">{order.customer_email || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td className="items-cell">
                    {(order.items_summary || '').split(', ').map((item, i) => (
                      <span key={i} className="item-tag">{item}</span>
                    ))}
                  </td>
                  <td className="total-cell"><strong>{formatCurrency(order.total_amount || order.total)}</strong></td>
                  <td><span className={`source-badge source-${(order.channel || 'kiosk').toLowerCase()}`}>{order.channel || 'kiosk'}</span></td>
                  <td><span className={`status-badge ${getStatusColor(order.status)}`}>{order.status}</span></td>
                  <td className="time-cell">{order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</td>
                  <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                    {getNextStatus(order.status) && (
                      <button
                        className="action-btn-sm primary"
                        onClick={() => handleStatusChange(order.id, getNextStatus(order.status))}
                      >
                        → {getNextStatus(order.status).replace('_', ' ')}
                      </button>
                    )}
                    <button className="action-btn-sm outline" onClick={() => openDetail(order)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order {selectedOrder.order_number || selectedOrder.id}</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>

            <div className="order-detail-body">
              <div className="detail-grid">
                <div className="detail-section">
                  <h4>Customer Information</h4>
                  <div className="detail-row"><span className="detail-label">Name</span><span>{selectedOrder.customer_name || 'Guest'}</span></div>
                  <div className="detail-row"><span className="detail-label">Email</span><span>{selectedOrder.customer_email || 'N/A'}</span></div>
                </div>

                <div className="detail-section">
                  <h4>Order Details</h4>
                  <div className="detail-row"><span className="detail-label">Source</span><span className={`source-badge source-${(selectedOrder.channel || 'kiosk').toLowerCase()}`}>{selectedOrder.channel || 'kiosk'}</span></div>
                  <div className="detail-row"><span className="detail-label">Status</span><span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
                  <div className="detail-row"><span className="detail-label">Placed</span><span>{new Date(selectedOrder.created_at).toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              {selectedOrder.items && (
                <div className="detail-section">
                  <h4>Items Ordered</h4>
                  <table className="table detail-items-table">
                    <thead>
                      <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i}>
                          <td>{item.item_name || item.name}</td>
                          <td>{item.quantity || item.qty}</td>
                          <td>{formatCurrency(item.unit_price || item.price)}</td>
                          <td><strong>{formatCurrency((item.unit_price || item.price) * (item.quantity || item.qty))}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr><td colSpan="3" className="total-label" style={{textAlign: 'right', paddingRight: 'var(--space-16)'}}>Grand Total</td><td><strong>{formatCurrency(selectedOrder.total_amount || selectedOrder.total)}</strong></td></tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {getNextStatus(selectedOrder.status) && (
                <Button variant="primary" onClick={() => handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status))}>
                  Advance to {getNextStatus(selectedOrder.status).replace('_', ' ')}
                </Button>
              )}
              {selectedOrder.status !== 'refunded' && selectedOrder.status !== 'cancelled' && (
                <Button variant="danger" onClick={() => setShowRefundModal(true)}>
                  Initiate Refund
                </Button>
              )}
              <Button variant="outline" onClick={() => toast.success('Invoice generated')}>
                Generate Invoice
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {showRefundModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowRefundModal(false)}>
          <div className="modal-content refund-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Confirm Refund</h2>
              <button className="modal-close" onClick={() => setShowRefundModal(false)}>✕</button>
            </div>
            <div className="refund-body">
              <p>Are you sure you want to refund order <strong>{selectedOrder.order_number || selectedOrder.id}</strong>?</p>
              <div className="refund-summary">
                <div className="refund-row"><span>Customer</span><span>{selectedOrder.customer_name || 'Guest'}</span></div>
                <div className="refund-row"><span>Amount</span><span className="refund-amount">{formatCurrency(selectedOrder.total_amount || selectedOrder.total)}</span></div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="danger" onClick={() => handleRefund(selectedOrder.id)}>Confirm Refund</Button>
              <Button variant="ghost" onClick={() => setShowRefundModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
