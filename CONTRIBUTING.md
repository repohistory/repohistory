# Contributing

We welcome everyone to contribute to Repohistory. This document is to help you understand the process of contributing and ensure a smooth experience. Whether you're fixing a bug, adding a new feature, or improving the documentation, your help is appreciated.

## Development

### Setup GitHub Apps

Repohistory fetch repository data through GitHub Apps. You need to register a new GitHub App first:
1. Since the development environment is local, you need to expose your local server to the internet. You can use [ngrok](https://ngrok.com/) for this purpose. Example: `ngrok http 3000`
2. Go to [GitHub Developer Settings](https://github.com/settings/apps)
3. Click on "New GitHub App"
4. Fill in the required fields:
  - Callback URL: `http://127.0.0.1:3000/login`
  - Webhook URL: `https://your-exposed-url-in-step-one/api/webhooks`
  - Permissions & events: `Repository Administration: Read-only`, `Repository Metadata: Read-only`

### Setup Local Environment

1. Clone the repository: `git clone https://github.com/repository/repository`
2. Navigate to the project directory: `cd repository`
3. Install dependencies: `yarn`
4. Install a containerization tool, such as Docker Desktop, OrbStack, podman desktop, or another alternative.
5. Run Supabase: `npx supabase start`
6. Create `.env.local` file with following content:
```text
GITHUB_APP_ID="your app id when you create a GitHub App"
NEXT_PUBLIC_GITHUB_APP_CLIENT_ID="your app client id when you create a GitHub App"
GITHUB_APP_CLIENT_SECRET="your app client secret when you create a GitHub App"
GITHUB_APP_WEBHOOK_SECRET="your app webhook secret when you create a GitHub App"
GITHUB_APP_PRIVATE_KEY="-----BEGIN PRIVATE KEY....END PRIVATE KEY----"
NEXT_PUBLIC_SITE_URL="http://127.0.0.1:3000"
NEXT_PUBLIC_SUPABASE_URL="API URL from step 5 output"
NEXT_PUBLIC_SUPABASE_ANON_KEY="anon key from step 5 output"
```

Note that `GITHUB_APP_PRIVATE_KEY` should be in `PKCS#8` format. You can convert the key using the following command:
```bash
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private-key.pem -out private-key-pkcs8.key
```

7. Run the web app: `yarn run dev`
8. Install your GitHub App on your account, and then you can access the web app at http://127.0.0.1:3000
