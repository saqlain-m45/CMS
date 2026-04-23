import Navbar from '../components/Navbar';

const VALUES = [
  { icon: '🎯', title: 'Our Mission', desc: 'To provide educational institutions with a powerful, intuitive management platform that simplifies academic operations and enhances collaboration between administrators, teachers, and students.' },
  { icon: '👁️', title: 'Our Vision', desc: 'To become the leading college management solution trusted by institutions worldwide, setting the standard for digital academic excellence and operational efficiency.' },
  { icon: '💡', title: 'Our Approach', desc: 'We believe in building tools that are both powerful and easy to use. Every feature is designed with real-world academic workflows in mind, ensuring seamless adoption and immediate productivity gains.' },
];

const TEAM = [
  { name: 'Dr. Sarah Johnson', role: 'Academic Director', initials: 'SJ' },
  { name: 'Prof. Ahmed Khan', role: 'Technical Lead', initials: 'AK' },
  { name: 'Maria Gonzalez', role: 'Student Affairs', initials: 'MG' },
];

const HIGHLIGHTS = [
  { icon: '🏫', title: 'Multi-Department Support', desc: 'Manage multiple departments, programs, and year levels from a single unified platform.' },
  { icon: '📱', title: 'Fully Responsive', desc: 'Access the system from any device — desktop, tablet, or smartphone with a consistent experience.' },
  { icon: '🔐', title: 'Secure & Reliable', desc: 'Built with enterprise-grade security practices including role-based access control and encrypted sessions.' },
  { icon: '📈', title: 'Real-time Analytics', desc: 'Track attendance, performance, and enrollment trends with live dashboard analytics and reporting.' },
];

export default function About() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="about-hero">
        <h1>About CollegeMS</h1>
        <p>
          We're building the future of academic management — a platform that empowers institutions
          to focus on what matters most: education.
        </p>
      </section>

      {/* Values */}
      <div className="about-content">
        <div className="about-grid">
          {VALUES.map((v) => (
            <div key={v.title} className="about-card">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="section-header" style={{ marginTop: '2rem' }}>
          <h2>Why Choose Us</h2>
          <p>Built with modern technology and designed for real academic workflows.</p>
        </div>
        <div className="features-grid" style={{ maxWidth: '100%' }}>
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="feature-card">
              <div className="feature-icon indigo">{h.icon}</div>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <section className="team-section">
        <div className="section-header">
          <h2>Leadership Team</h2>
          <p>Meet the people behind CollegeMS who are passionate about transforming education.</p>
        </div>
        <div className="team-grid">
          {TEAM.map((t) => (
            <div key={t.name} className="team-card">
              <div className="team-avatar">{t.initials}</div>
              <h4>{t.name}</h4>
              <div className="team-role">{t.role}</div>
              <p>Dedicated to making academic management accessible and efficient for all stakeholders.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} College Management System. All rights reserved.</p>
      </footer>
    </>
  );
}
