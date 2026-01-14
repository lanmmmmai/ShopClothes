/**
 * Environment variable validation
 * JWT_SECRET is required in production
 */

export function validateEnv() {
  const required = ['NOCODB_TOKEN', 'NOCODB_PROJECT'];

  const isProd = process.env.NODE_ENV === 'production';
  const missing = [];

  // JWT_SECRET is required in production
  if (isProd && !process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is required in production!');
    process.exit(1);
  }

  if (isProd && process.env.JWT_SECRET === 'change-me-in-production') {
    console.error('❌ JWT_SECRET cannot use default value in production!');
    process.exit(1);
  }

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => {
      console.error(`   - ${key}`);
    });
    console.error('\n⚠️  Please check your .env file or environment configuration.');
    if (isProd) {
      console.error('🚨 Production requires all environment variables to be set!');
      process.exit(1);
    } else {
      console.error('⚠️  Development mode: Some features may not work correctly.');
    }
  }

  // Warn if JWT_SECRET is default value (development only)
  if (!isProd && process.env.JWT_SECRET === 'change-me-in-production') {
    console.warn('⚠️  WARNING: JWT_SECRET is using default value. Change it in production!');
  }

  if (!missing.length && isProd) {
    console.log('✅ All required environment variables are set');
  }
}
