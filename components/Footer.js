export default function Footer({ meta }) {
  return (
    <footer style={{ borderTop:'1px solid rgba(0,0,0,0.06)', padding:'48px 0 40px', textAlign:'center' }}>
      <div className="container" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
        <img
          src="/logo.png"
          alt="Logo"
          width={36}
          height={36}
          style={{
            height: 36,
            width: 'auto',
            display: 'block',
            opacity: 0.9,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))',
          }}
        />
        <p style={{ color:'#222222', fontSize:'0.85rem', fontFamily:'Montserrat, sans-serif', opacity: 1 }}>
          &copy; {new Date().getFullYear()} {meta?.name || 'Avishka Bambaradeniya'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
