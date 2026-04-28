# Pocket ID App Launcher

A clean, simple, and aesthetically pleasing application launcher designed for families and friends. It integrates directly with your self-hosted **Pocket ID** instance to fetch applications and handle authentication.

![Screenshot Placeholder](https://via.placeholder.com/800x450?text=Pocket+ID+App+Launcher)

## Features
- **OIDC Authentication:** Secured by your own Pocket ID instance.
- **Dynamic App List:** Automatically fetches applications you have access to via the Pocket ID API.
- **Clean UI:** Modern design inspired by the Pocket ID portal.
- **Customizable:** Change titles and descriptions via environment variables.

---

## 🚀 Setup Instructions

### 1. Pocket ID Configuration

Before deploying the launcher, you need to configure two things in your Pocket ID administration panel:

#### A. Create an OIDC Client
1. Go to **Administration** > **OIDC Clients** > **Add Client**.
2. **Name:** `App Launcher` (or whatever you prefer).
3. **Redirect URIs:** `https://launcher.yourdomain.com/callback` (Replace with your actual URL).
4. **Client ID & Secret:** Note these down; you'll need them for the environment variables.

#### B. Generate an API Key
1. Go to **Administration** > **API Tokens**.
2. Create a new token with at least `read` access to clients.
3. Note this token down.

### 2. Environment Variables

Create a `.env` file (or set these in your Docker template):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `POCKET_ID_URL` | The URL of your Pocket ID instance | `https://auth.example.com` |
| `POCKET_ID_API_KEY` | The API Token from step 1B | `pid_xxxx...` |
| `OIDC_CLIENT_ID` | Client ID from step 1A | `...` |
| `OIDC_CLIENT_SECRET` | Client Secret from step 1A | `...` |
| `PUBLIC_APP_URL` | The public URL of this launcher | `https://launcher.example.com` |
| `PUBLIC_LAUNCHER_TITLE` | Custom title shown in header | `Family Apps` |
| `PUBLIC_LAUNCHER_DESCRIPTION` | Custom welcome message | `Access our services below` |

---

## 🐳 Docker Deployment

### Unraid Installation
1. Go to the **Docker** tab in Unraid.
2. Click **Add Container**.
3. **Name:** `pocket-id-launcher`
4. **Repository:** `your-registry/pocket-id-launcher` (or build locally).
5. **Network Type:** `Bridge` (or your preferred network).
6. **Fixed IP:** (Optional)
7. **Port 3000:** Map to your desired host port.
8. Add the **Environment Variables** listed above using the "Add another Path, Port, Variable, Label or Device" button.

### Cloudflare Tunnel
If using a Cloudflare Tunnel:
1. Point your public hostname (e.g., `launcher.example.com`) to the local IP and port of this container (e.g., `http://192.168.1.10:3000`).
2. Ensure your `PUBLIC_APP_URL` matches the Cloudflare hostname exactly.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

## 📝 License
MIT
