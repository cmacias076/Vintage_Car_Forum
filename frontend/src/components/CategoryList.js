import React from 'react';
 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        const data = await res.json();
        if (!mounted) return;

        const list = Array.isArray(data) ? data : data?.categories || [];
        setCategories(list);
      } catch (e) {
        if (mounted) setErr('Failed to load categories.');
        // eslint-disable-next-line no-console
        console.error('Error fetching categories:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside className="panel" style={{ padding: 16 }}>
      <h3 style={{ marginBottom: 8 }}>Categories</h3>
      <p className="subtle" style={{ marginTop: 0, marginBottom: 12 }}>
        Browse topics by section
      </p>

      {loading && <p className="meta">Loading…</p>}
      {err && <p className="error">{err}</p>}

      {!loading && !err && (
        <ul className="scroll-list" style={{ marginTop: 8 }}>
          {categories.length === 0 && <li className="meta">No categories yet.</li>}
          {categories.map((c) => (
            <li
              key={c._id || c.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <span style={{ fontWeight: 600 }}>{c.name}</span>
              <button
                className="btn-ghost"
                onClick={() => navigate(`/dashboard?category=${c._id || c.id}`)}
                aria-label={`View questions in ${c.name}`}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default CategoryList;
