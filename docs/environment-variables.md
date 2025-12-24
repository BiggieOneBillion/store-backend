# Environment Variables Reference

The Multi-Store E-Commerce Backend uses environment variables for configuration. All variables are defined in the `.env` file at the root of the project.

## Essential Variables

These variables are required for the application to function correctly.

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NODE_ENV` | Application environment | `development`, `production`, `test` |
| `PORT` | Port number the server listens on | `3000` |
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/multi-store` |

## JWT Configuration

Used for secure token-based authentication.

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `JWT_SECRET` | Secret key for signing JWTs | `your-super-secret-key` |
| `JWT_ACCESS_EXPIRATION_MINUTES` | Access token lifespan | `30` |
| `JWT_REFRESH_EXPIRATION_DAYS` | Refresh token lifespan | `30` |
| `JWT_RESET_PASSWORD_EXPIRATION_MINUTES` | Reset password token lifespan | `10` |
| `JWT_VERIFY_EMAIL_EXPIRATION_MINUTES` | Email verification token lifespan | `10` |

## Email Configuration (SMTP)

Required for sending transactional emails like verification links and password resets.

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USERNAME` | SMTP account username | `you@gmail.com` |
| `SMTP_PASSWORD` | SMTP account password | `your-app-password` |
| `EMAIL_FROM` | Sender email address | `noreply@yourdomain.com` |

## External Integrations

### Paystack (Payments)
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `PAYSTACK_SECRET_KEY` | Paystack secret key | `sk_test_...` |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key | `pk_test_...` |
| `PAYSTACK_CALLBACK_URL` | URL Paystack redirects to after payment | `http://localhost:3000/v1/paystack/verify` |

### Cloudinary (Media Storage)
| Variable | Description | Example Value |
|----------|-------------|---------------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `1234567890` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefg...` |

## Security & Best Practices

- **Never commit `.env` files** to version control. An `.env.example` file is provided for reference.
- In production, use your hosting provider's (Render, Heroku, etc.) environment variable management system.
- Ensure `JWT_SECRET` is long, complex, and unique.
- For Gmail SMTP, use an **App Password** instead of your regular account password.
- Set `NODE_ENV` to `production` when deploying to a live server to enable performance optimizations and security features.
