import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AppShell({
  children,
  role = 'Responder',
}) {
  const location = useLocation();

  const navigation = [
    {
      label: 'Overview',
      path: '/responder',
      icon: '▦',
    },
    {
      label: 'Incidents',
      path: '/responder',
      icon: '◉',
    },
    {
      label: 'History',
      path: '/history',
      icon: '◷',
    },
    {
      label: 'Operations',
      path: '/coordinator',
      icon: '⌁',
    },
  ];

  return (
    <div className="fm-shell">

      {/* SIDEBAR */}
      <aside className="fm-sidebar">

        <Link to="/" className="fm-shell-brand">
          <span className="fm-shell-brand-mark">+</span>

          <div>
            <strong>FirstMinutes</strong>
            <span>Emergency Response</span>
          </div>
        </Link>

        <div className="fm-sidebar-section">
          <span className="fm-sidebar-label">
            WORKSPACE
          </span>

          <nav className="fm-sidebar-nav">
            {navigation.map((item) => {
              const active =
                location.pathname === item.path ||
                (
                  item.path === '/responder' &&
                  location.pathname.startsWith('/responder/incident')
                );

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`fm-sidebar-link ${
                    active ? 'active' : ''
                  }`}
                >
                  <span className="fm-sidebar-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="fm-sidebar-bottom">

          <div className="fm-role-card">
            <span className="fm-role-label">
              CURRENT ROLE
            </span>

            <strong>
              {role}
            </strong>

            <span className="fm-role-status">
              <span></span>
              System connected
            </span>
          </div>

          <Link
            to="/"
            className="fm-back-home"
          >
            ← Exit workspace
          </Link>

        </div>

      </aside>


      {/* MAIN AREA */}
      <div className="fm-shell-main">

        {/* TOPBAR */}
        <header className="fm-topbar">

          <div>
            <span className="fm-topbar-section">
              FIRSTMINUTES / {role.toUpperCase()}
            </span>

            <div className="fm-topbar-title">
              Emergency Response Console
            </div>
          </div>

          <div className="fm-topbar-right">

            <div className="fm-system-status">
              <span></span>
              System online
            </div>

            <div className="fm-user-chip">
              <div className="fm-user-avatar">
                R
              </div>

              <div>
                <strong>
                  {role}
                </strong>

                <span>
                  Active session
                </span>
              </div>
            </div>

          </div>

        </header>


        {/* CONTENT */}
        <main className="fm-shell-content">
          {children}
        </main>

      </div>

    </div>
  );
}