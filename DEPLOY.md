# Link-in-Bio — Deploy Guide

## Deploy to Railway (permanent URL, always on)

1. Go to railway.app → New Project → Deploy from GitHub repo
2. Push this folder to a GitHub repo first:
   ```
   cd ~/Desktop/Code-Projects/link-in-bio
   git init && git add . && git commit -m "init"
   gh repo create david-link-in-bio --public --push --source .
   ```
3. In Railway: connect the repo → it auto-detects Node.js
4. Add env variable: `ADMIN_SECRET=david-linkinbio-2026`
5. Railway gives you a URL like `david-link-in-bio.up.railway.app`

---

## Swap the Instagram link

1. Open Instagram → Edit Profile
2. Tap **Links** → delete the Google Sites link
3. Paste your Railway URL (e.g. `david-link-in-bio.up.railway.app`)
4. Label it "Links Hub" → Save

Done. All your Instagram traffic now hits the new page.

---

## Edit anything on command (tell Claude what to change)

Claude updates the page by hitting:

```
POST /admin/update?secret=david-linkinbio-2026
Body: { "field": "bio", "value": "New bio text here" }
```

Fields you can update: `name`, `tagline`, `bio`, `buttons`

### Waitlist entries
```
GET /admin/waitlist?secret=david-linkinbio-2026
```

---

## Run locally to preview

```bash
cd ~/Desktop/Code-Projects/link-in-bio
bash start.sh
# Open http://localhost:3001
```
