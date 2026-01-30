# Environment Configuration Guide

## .env File Setup

### Step 1: Create .env File
```bash
cp .env.example .env
```

### Step 2: Generate JWT Secret
Generate a secure random string (min 32 characters):

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using Python:**
```bash
python -c "import os; print(os.urandom(32).hex())"
```

Copy the generated string to `JWT_SECRET` in .env

### Step 3: MongoDB Connection

**Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/blog-platform
```

**MongoDB Atlas (Cloud):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a user with password
4. Get connection string
5. Replace in .env:
```env
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/blog-platform?retryWrites=true&w=majority
```

### Step 4: Google OAuth Setup

#### Get Google Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API:
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" in left sidebar
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Click "Create"
5. Copy "Client ID" and "Client Secret"
6. Add to .env:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Complete .env File

```env
# ===== Database =====
MONGO_URI=mongodb://localhost:27017/blog-platform

# ===== Server =====
PORT=5000
NODE_ENV=development

# ===== JWT Configuration =====
# Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-generated-secret-key-here-minimum-32-characters-long
JWT_EXPIRE=7d

# ===== Google OAuth =====
# Get from: https://console.cloud.google.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## Environment by Deployment

### Development (.env.development)
```env
MONGO_URI=mongodb://localhost:27017/blog-platform
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=dev-google-id
GOOGLE_CLIENT_SECRET=dev-google-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Production (.env.production)
```env
MONGO_URI=mongodb+srv://user:password@production-cluster.mongodb.net/blog-platform
PORT=443
NODE_ENV=production
JWT_SECRET=use-secure-production-secret-key-very-long-random-string
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=production-google-id
GOOGLE_CLIENT_SECRET=production-google-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
```

### Testing (.env.test)
```env
MONGO_URI=mongodb://localhost:27017/blog-platform-test
PORT=5001
NODE_ENV=test
JWT_SECRET=test-secret-key
JWT_EXPIRE=1h
GOOGLE_CLIENT_ID=test-google-id
GOOGLE_CLIENT_SECRET=test-google-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

## Important Security Notes

### ⚠️ DO NOT:
- ❌ Commit .env file to Git (already in .gitignore)
- ❌ Share JWT_SECRET publicly
- ❌ Use weak secrets in production
- ❌ Store credentials in code
- ❌ Use development secrets in production
- ❌ Expose environment variables in logs

### ✅ DO:
- ✅ Generate strong random secrets
- ✅ Use different secrets per environment
- ✅ Rotate secrets periodically
- ✅ Use environment management tools (Vault, etc.)
- ✅ Keep .env in .gitignore
- ✅ Document required variables

## .gitignore Setup

Ensure your `.gitignore` contains:
```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json
yarn.lock

# Logs
logs/
*.log

# OS files
.DS_Store
.idea/
.vscode/
```

## Verification Checklist

- [ ] .env file created from .env.example
- [ ] MONGO_URI set and MongoDB is running
- [ ] JWT_SECRET is generated (min 32 chars)
- [ ] GOOGLE_CLIENT_ID configured
- [ ] GOOGLE_CLIENT_SECRET configured
- [ ] GOOGLE_CALLBACK_URL set correctly
- [ ] .env is in .gitignore
- [ ] NODE_ENV is set appropriately
- [ ] PORT is not in use

## Testing Configuration

```bash
# Test if environment is properly loaded
node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET ? '✓ JWT_SECRET set' : '✗ JWT_SECRET missing')"
```

## Troubleshooting

### "MONGO_URI is not defined"
- Check .env file exists in project root
- Verify MONGO_URI is set
- Ensure MongoDB is running

### "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### "JWT_SECRET must be provided"
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Add to .env file
```

### "Google OAuth fails"
1. Verify GOOGLE_CLIENT_ID in Google Cloud Console
2. Check callback URL matches in console settings
3. Ensure GOOGLE_CALLBACK_URL in .env matches

### "Token verification fails"
- Verify JWT_SECRET is the same in all environments
- Check token hasn't expired (JWT_EXPIRE)
- Ensure Bearer token format: `Bearer <token>`

## Production Deployment Tips

1. **Use Environment Service:**
   - AWS Secrets Manager
   - Azure Key Vault
   - Vault by HashiCorp
   - Heroku Config Vars

2. **For Cloud Hosting:**
   ```bash
   # Heroku
   heroku config:set JWT_SECRET=your-secret

   # AWS
   aws secretsmanager create-secret --name blog-api-secrets

   # Azure
   az keyvault secret set --vault-name myKeyvault --name jwt-secret
   ```

3. **Rotate Secrets:**
   - Change JWT_SECRET periodically
   - Update Google OAuth credentials
   - Refresh database passwords

4. **Monitor Logs:**
   - Never log environment variables
   - Monitor failed authentication attempts
   - Alert on suspicious activity

## References

- [Node.js dotenv Documentation](https://github.com/motdotla/dotenv)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
