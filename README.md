# Krishi Mitra: A Multilingual AI-Powered Agricultural Advisor with RAG-Enabled Real-Time Decision Support

## Tech Stack

Frontend: React Native Expo, Nativewind
Backend: Hono, oRPC, mongoose, better-auth
Other: monorepo

## Getting Started

### Project Structure

```
krishi-mitra/
├── apps/
│   ├── native/      # Mobile application (React Native, Expo)
│   └── server/      # Backend API (Hono, ORPC)
```

1. install the dependencies:

```bash
pnpm install
```
2. setup .env in both, you can find .env.example in both
- `apps/native/.env` 
- `apps/server/.env`

3. install dependencies for both apps:

```bash
pnpm install 
```

4. run the both:

```bash
pnpm dev
```

5. run app
- server will be live at http://localhost:3000
- for mobile app to run it needs "Expo Go" from playstore, 
  scan the QR code from terminal, and it will install and run the app.

6. n8n
- see below is very complicated so you can skip it unless you want to run locally or explore it or customize it.
- if you want to skip it, just go to apps/server/.env.example and use mine self hosted creds. that's it. 

#### Setup n8n 
- Download the [COH RAG Final.json](./r) file and import it & activate it.
- you need to setup the credentials for the services used in the workflow. you can visit [here for more info](./README.n8n.md)
- [important] copy the webhook Production URL and paste it in the .env file of the server app as `N8N_WEBHOOK_URL`, restart the server for the changes to take effect.
- [more info about n8n is inside the README.n8n.md](./README.n8n.md)


# Demo Video Link

Sorry I can't prepare the demo video on time :(