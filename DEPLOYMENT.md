# Publish MindMate

The app needs a Node server; GitHub Pages cannot run its backend. No passwords, API keys, local profiles, rooms or backups belong in GitHub. The ignore file excludes these.

## GitHub
Sign in securely as ganapathybalasingar-sy and create a repository named mindmate-ai (or another available name). Push this folder's main branch. Never put passwords or tokens in remote URLs. The repository link is not the app link.

## Render
1. Sign in to Render and connect your GitHub repository.
2. Create a Blueprint from render.yaml. It specifies a free Node web service.
3. Wait for successful deployment and open the HTTPS address shown by Render.
4. Test with two browser sessions: room invitation, chat, notes and quiz.
5. Live AI is optional. Add a NEW OPENAI_API_KEY through Render's secret environment settings if required. No local API key is uploaded automatically.

The app derives its public URL from RENDER_EXTERNAL_URL, enabling correct invitation links and secure cookies.

## Persistence and boundaries
The free deployment is a demonstration: local JSON profiles/rooms can disappear after a restart or deployment, and instances can sleep. Browser learning memory remains local. Do not use the free service for durable student data.
For durable social data, use a paid persistent disk mounted at /var/data and set DATA_FILE=/var/data/mindmate.json, or migrate to a managed database. This configuration does not purchase a paid service. Use only one instance with this JSON store.

Browser sessions have no account recovery. Anyone with an invitation can join that room. Avoid sensitive student information. Enabling public AI can spend the configured key's credits; add appropriate access and spending controls first.

A hosting account and successful deployment are required before a real live URL exists. Adding this file does not deploy anything.

Documentation: https://render.com/docs/blueprint-spec and https://render.com/docs/free
