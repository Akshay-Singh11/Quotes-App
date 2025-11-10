import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    axios
      .get('http://localhost:8080/admin/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load analytics'));
  }, [token]);

  if (!token) return <div style={{ color: 'white', padding: 24 }}>Login as admin to view analytics.</div>;
  if (error) return <div style={{ color: 'salmon', padding: 24 }}>{error}</div>;
  if (!data) return <div style={{ color: 'white', padding: 24 }}>Loading analytics...</div>;

  const { totalUsers, totalQuotes, topQuotes, eventsLast7Days } = data;

  const groupByDay = () => {
    const map = {};
    for (const e of eventsLast7Days) {
      const day = e._id.day;
      if (!map[day]) map[day] = {};
      map[day][e._id.type] = e.count;
    }
    return map;
  };

  const daily = groupByDay();

  return (
    <div style={{ padding: 24, color: 'white' }}>
      <h2>Admin Analytics</h2>
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Total Quotes" value={totalQuotes} />
      </div>

      <section style={{ marginTop: 32 }}>
        <h3>Top Quotes by Favorites</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {(topQuotes || []).map((q) => (
            <li key={q.quoteId} style={{ marginBottom: 8, background: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 8 }}>
              <div style={{ fontWeight: 600 }}>{q.text}</div>
              <div style={{ opacity: 0.8 }}>— {q.author}</div>
              <div style={{ marginTop: 6 }}>❤ {q.favorites}</div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 32 }}>
        <h3>Events in last 7 days</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.entries(daily).map(([day, types]) => (
            <div key={day}>
              <div style={{ marginBottom: 6, opacity: 0.9 }}>{day}</div>
              <MiniBar type="view" value={types.view || 0} color="#7dd3fc" />
              <MiniBar type="favorite" value={types.favorite || 0} color="#fca5a5" />
              <MiniBar type="share" value={types.share || 0} color="#a7f3d0" />
              <MiniBar type="create_quote" value={types.create_quote || 0} color="#ddd6fe" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.08)', padding: 16, borderRadius: 12, minWidth: 180 }}>
      <div style={{ opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function MiniBar({ type, value, color }) {
  const width = Math.min(100, value * 10); // simple scale
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <div style={{ width: 90, textTransform: 'capitalize', opacity: 0.9 }}>{type}</div>
      <div style={{ height: 10, width: `${width}%`, maxWidth: 400, background: color, borderRadius: 6 }} />
      <div style={{ width: 32, textAlign: 'right' }}>{value}</div>
    </div>
  );
}

