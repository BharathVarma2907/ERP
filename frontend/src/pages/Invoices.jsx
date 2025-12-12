import { useState, useEffect } from 'react';
import { financeService } from '../services';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import './Invoices.css';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await financeService.getInvoices();
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      invoices.map(inv => ({
        'Invoice #': inv.invoice_number,
        'Customer': inv.customer_name,
        'Project': inv.project_name,
        'Date': new Date(inv.invoice_date).toLocaleDateString(),
        'Due Date': new Date(inv.due_date).toLocaleDateString(),
        'Total': inv.total_amount,
        'Paid': inv.paid_amount,
        'Status': inv.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    XLSX.writeFile(wb, 'invoices.xlsx');
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      paid: 'status-success',
      partial: 'status-warning',
      pending: 'status-info',
      overdue: 'status-danger',
    };
    return statusClasses[status] || '';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="invoices-page">
      <div className="page-header">
        <h1>Invoices</h1>
        <button onClick={exportToExcel} className="btn btn-primary">
          <Download size={18} /> Export to Excel
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Project</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td><strong>{invoice.invoice_number}</strong></td>
                  <td>{invoice.customer_name}</td>
                  <td>{invoice.project_name}</td>
                  <td>{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                  <td>{new Date(invoice.due_date).toLocaleDateString()}</td>
                  <td>${parseFloat(invoice.total_amount).toLocaleString()}</td>
                  <td>${parseFloat(invoice.paid_amount).toLocaleString()}</td>
                  <td>${(parseFloat(invoice.total_amount) - parseFloat(invoice.paid_amount)).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
