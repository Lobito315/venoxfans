export default function Health() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>System Health: OK</h1>
      <p>Deployment timestamp: {new Date().toISOString()}</p>
      <p>Environment: {process.env.NODE_ENV}</p>
    </div>
  );
}
