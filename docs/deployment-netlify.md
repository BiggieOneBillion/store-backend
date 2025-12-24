# Deploying to Netlify

Netlify is primarily designed for hosting static sites and frontend applications. However, you can host your Node.js API on Netlify using **Netlify Functions** (which are based on AWS Lambda).

> [!IMPORTANT]
> Because this is a traditional Express.js application, some refactoring is required to make it work as a "serverless" function on Netlify. For production-scale APIs, platforms like **Render**, **Railway**, or **DigitalOcean App Platform** are generally recommended over Netlify for hosting full Express servers.

## Approach 1: Netlify Functions (Serverless)

To deploy this Express app to Netlify, you typically use the `serverless-http` wrapper.

### Step 1: Install `serverless-http`
```bash
yarn add serverless-http
# or
npm install serverless-http
```

### Step 2: Create a Netlify Function
Create a new folder `netlify/functions` and a file named `api.js`:

```javascript
// netlify/functions/api.js
const serverless = require('serverless-http');
const app = require('../../src/app'); // Adjust path to your Express app

module.exports.handler = serverless(app);
```

### Step 3: Configure `netlify.toml`
Create a `netlify.toml` file in the root directory:

```toml
[build]
  command = "yarn install" # or npm install
  publish = "public" # This can be an empty folder if you ONLY have an API

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

### Step 4: Deployment
1. Connect your repository to Netlify.
2. Set your **Environment Variables** in the Netlify dashboard (**Site settings > Environment variables**).
3. Your API will be available at `https://your-site.netlify.app/api/v1/...`.

## Approach 2: Using Netlify for Frontend only

If you are building a full-stack application, the most common pattern is:
- **Netlify**: Hosts your frontend (React, Vue, Next.js).
- **Render/Heroku/DigitalOcean**: Hosts this Node.js API.

### Connection
In your frontend application hosted on Netlify, point your API base URL to your backend on Render:
```javascript
const API_BASE_URL = "https://multi-store-backend.onrender.com/v1";
```

## Considerations for Serverless on Netlify

- **Cold Starts**: Serverless functions may experience a slight delay (cold start) if they haven't been called recently.
- **Execution Limits**: Netlify Functions have a timeout limit (default 10s).
- **Database Connections**: You must ensure your MongoDB connection is handled efficiently (e.g., using connection pooling or closing connections properly) to avoid hitting connection limits in a serverless environment.
- **File Uploads**: Local file storage (`tempFileDir`) will NOT work on serverless as the filesystem is ephemeral. You must use Cloudinary or S3 directly.

## Conclusion

While Netlify is excellent for many use cases, **Render** is the recommended platform for this specific project due to its native support for long-running Node.js processes and easier configuration for Express apps.
