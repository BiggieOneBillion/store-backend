# Deploying to Render

Render is a unified cloud platform to build and run all your apps and websites. It is an excellent choice for hosting this Node.js API due to its simplicity and native support for web services.

## Prerequisites

1.  **Render Account**: Sign up at [render.com](https://render.com/).
2.  **GitHub/GitLab Repository**: Push your code to a remote repository.
3.  **MongoDB Atlas**: Set up a production database cluster. Render does not provide built-in MongoDB hosting.

## Step 1: Set up MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist all IP addresses (`0.0.0.0/0`) in Atlas Network Security (or use Render's specific outbound IPs).
3. Copy your connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/multi-store?retryWrites=true&w=majority`).

## Step 2: Create a New Web Service on Render

1. Click **New +** and select **Web Service**.
2. Connect your GitHub/GitLab repository.
3. Configure the service:
    - **Name**: `multi-store-backend` (or your preferred name)
    - **Region**: Choose the one closest to your users.
    - **Branch**: `main` (or your production branch)
    - **Root Directory**: `server` (if your server code is in a subdirectory)
    - **Runtime**: `Node`
    - **Build Command**: `yarn install` (or `npm install`)
    - **Start Command**: `node src/index.js` (Note: PM2 is not required on Render as it handles process management).

## Step 3: Configure Environment Variables

Navigate to the **Environment** tab in your Render dashboard and add the following variables:

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | `3000` (Render will automatically direct traffic to this port) |
| `MONGODB_URL` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secure, random string |
| `JWT_ACCESS_EXPIRATION_MINUTES` | `30` |
| `JWT_REFRESH_EXPIRATION_DAYS` | `30` |
| `SMTP_HOST` | Your SMTP server |
| `SMTP_PORT` | `587` |
| `SMTP_USERNAME` | Your email |
| `SMTP_PASSWORD` | Your email app password |
| `EMAIL_FROM` | `noreply@yourdomain.com` |
| `PAYSTACK_SECRET_KEY` | Your Paystack production secret key |
| `PAYSTACK_PUBLIC_KEY` | Your Paystack production public key |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

## Step 4: Deploy

Render will automatically start the build and deployment process after you save the configuration. Once finished, you will receive a URL (e.g., `https://multi-store-backend.onrender.com`).

## Monitoring and Logs

-   **Events**: Check the Events tab for deployment status and history.
-   **Logs**: Use the Logs tab to see real-time output from your application.
-   **Metrics**: View CPU and memory usage to ensure your service is healthy.

## Custom Domain (Optional)

1. Go to **Settings > Custom Domains**.
2. Add your domain name.
3. Update your DNS settings as instructed by Render.

## Troubleshooting

-   **Build Failures**: Check the logs for missing dependencies or syntax errors.
-   **Startup Issues**: Ensure your start command and environment variables are correct.
-   **Connection Refused**: Double-check that your MongoDB Atlas whitelist includes the correct IP addresses.
