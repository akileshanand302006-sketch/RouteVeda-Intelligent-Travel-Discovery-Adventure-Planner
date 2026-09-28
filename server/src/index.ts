import { createApp } from './app';
import { checkDatabaseConnection, closePool } from './config/database';

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = createApp();

async function startServer() {
  console.log('========================================================================');
  console.log('🚀 ROUTEVEDA NODE.JS / EXPRESS REST API SERVER');
  console.log('========================================================================\n');

  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    console.log(`✅ PostgreSQL Connected (${dbStatus.version?.substring(0, 30)}...)`);
    console.log(`🗺️ PostGIS Spatial Extension: ${dbStatus.postgis ? 'ENABLED ✅' : 'NOT DETECTED ⚠️'}`);
  } else {
    console.warn(`⚠️ PostgreSQL Connection Notice: ${dbStatus.error}`);
    console.warn(`💡 Ensure PostgreSQL is running on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);
  }

  const server = app.listen(PORT, () => {
    console.log(`\n📡 RouteVeda REST API running on http://localhost:${PORT}`);
    console.log(`   - Health check: http://localhost:${PORT}/api/health`);
    console.log(`   - Destinations: http://localhost:${PORT}/api/destinations`);
    console.log(`   - States:       http://localhost:${PORT}/api/states`);
    console.log(`   - Auth:         http://localhost:${PORT}/api/auth/me`);
    console.log(`   - Trips:        http://localhost:${PORT}/api/trips\n`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n🛑 Shutting down TripForge server gracefully...');
    server.close(async () => {
      await closePool();
      console.log('👋 Database connections closed. Server stopped.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch(console.error);
