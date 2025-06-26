import './DashboardCard.css';

export default function DashboardCard({ title, count }) {
  return (
    <div className="dashboard-card">
      <h4>{title}</h4>
      <p>{count}</p>
    </div>
  );
}