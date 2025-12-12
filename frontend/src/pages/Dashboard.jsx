import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, FileText, AlertTriangle, Briefcase } from 'lucide-react';
import { dashboardService, aiInsightsService } from '../services';
import './Dashboard.css';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [kpiData, insightsData] = await Promise.all([
        dashboardService.getKPIs(),
        aiInsightsService.getSummary(),
      ]);
      setKpis(kpiData.data);
      setInsights(insightsData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const cashFlowData = kpis?.cashFlowTrend?.map(item => ({
    month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    amount: parseFloat(item.total),
  })) || [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#e3f2fd' }}>
            <Briefcase size={24} color="#1976d2" />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Total Projects</div>
            <div className="kpi-value">{kpis?.totalProjects || 0}</div>
            <div className="kpi-subtext">{kpis?.activeProjects || 0} active</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#f3e5f5' }}>
            <FileText size={24} color="#7b1fa2" />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Total Invoices</div>
            <div className="kpi-value">{kpis?.totalInvoices || 0}</div>
            <div className="kpi-subtext">{kpis?.pendingPayments?.count || 0} pending</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fff3e0' }}>
            <DollarSign size={24} color="#f57c00" />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Pending Payments</div>
            <div className="kpi-value">{formatCurrency(kpis?.pendingPayments?.amount || 0)}</div>
            <div className="kpi-subtext">Amount outstanding</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ffebee' }}>
            <AlertTriangle size={24} color="#c62828" />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">High-Risk Projects</div>
            <div className="kpi-value">{kpis?.highRiskProjects || 0}</div>
            <div className="kpi-subtext">Require attention</div>
          </div>
        </div>

        <div className="kpi-card kpi-card-large">
          <div className="kpi-icon" style={{ backgroundColor: '#e8f5e9' }}>
            <TrendingUp size={24} color="#2e7d32" />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Total Revenue</div>
            <div className="kpi-value">{formatCurrency(kpis?.totalRevenue || 0)}</div>
            <div className="kpi-subtext">Year to date</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Cash Flow Trend</h3>
            <p>Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#0066cc" 
                strokeWidth={2}
                name="Cash Flow"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights Section */}
      {insights && (
        <div className="insights-section">
          <h2>AI Insights</h2>
          
          {insights.highRiskProjects?.length > 0 && (
            <div className="insight-card alert">
              <h3><AlertTriangle size={20} /> High-Risk Projects</h3>
              <ul>
                {insights.highRiskProjects.map(project => (
                  <li key={project.id}>
                    <strong>{project.project_name}</strong> - Risk Level: <span className={`risk-badge risk-${project.risk_level.toLowerCase()}`}>{project.risk_level}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.criticalDeviations?.length > 0 && (
            <div className="insight-card warning">
              <h3><TrendingDown size={20} /> Projects with Critical Deviations</h3>
              <ul>
                {insights.criticalDeviations.map(project => (
                  <li key={project.id}>
                    <strong>{project.project_name}</strong> - Behind by {Math.abs(parseFloat(project.deviation)).toFixed(1)}%
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
