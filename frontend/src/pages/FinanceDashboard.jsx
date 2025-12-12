import { useState, useEffect } from 'react';
import { financeService } from '../services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './FinanceDashboard.css';

const FinanceDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await financeService.getFinanceDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching finance dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Finance Dashboard Report', 14, 20);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    doc.text(`Accounts Receivable: $${data.accountsReceivable.toLocaleString()}`, 14, 45);
    doc.text(`Accounts Payable: $${data.accountsPayable.toLocaleString()}`, 14, 55);
    
    doc.save('finance-dashboard.pdf');
  };

  if (loading) return <div className="loading">Loading...</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="finance-dashboard">
      <div className="dashboard-header">
        <h1>Finance Dashboard</h1>
        <button onClick={exportToPDF} className="btn btn-primary">
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Accounts Receivable</div>
          <div className="kpi-value">${data?.accountsReceivable?.toLocaleString() || 0}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Accounts Payable</div>
          <div className="kpi-value">${data?.accountsPayable?.toLocaleString() || 0}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Overdue Invoices</div>
          <div className="kpi-value">{data?.overdueInvoices?.count || 0}</div>
          <div className="kpi-subtext">${data?.overdueInvoices?.amount?.toLocaleString() || 0}</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Budget vs Actual (Top 10 Projects)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.budgetVsActual || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="project_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" name="Budget" />
              <Bar dataKey="actual_cost" fill="#82ca9d" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Top 5 Customers by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.topCustomers || []}
                dataKey="total_revenue"
                nameKey="customer_name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data?.topCustomers?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
