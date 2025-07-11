// generate-jwt-secrets.js
import { randomBytes } from 'crypto';

function generateJWTSecrets() {
  const accessSecret = randomBytes(64).toString('hex');
  const refreshSecret = randomBytes(64).toString('hex');
  
  console.log('Add these to your .env file:');
  console.log('');
  console.log(`JWT_ACCESS_SECRET=${accessSecret}`);
  console.log(`JWT_REFRESH_SECRET=${refreshSecret}`);
  console.log('');
  console.log('⚠️  Keep these secrets secure and never commit them to version control!');
}

generateJWTSecrets();
