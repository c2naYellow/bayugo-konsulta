# BayuGO-Konsulta

A responsive, no-build web app for the **Barangay Bayugo Health Center** — inspired by a three-screen mobile mockup (login, home/shop, profile) and expanded into a full website.

Everything runs in the browser with plain HTML, CSS, and JavaScript. No frameworks, build step, or backend required.

## Demo

- **Username:** `demo`
- **Password:** `demo123`

You can also register a new account from the **Create account** tab and sign in with your email.

## Features

- Login, registration, forgot password, and password change
- Product catalog with search, category filters, and quick view
- Shopping cart with quantity controls and free-delivery threshold
- Checkout with COD or GCash and order confirmation
- Appointment booking, service preselection, and cancellation
- Services directory
- Profile editing, security settings, and notifications
- English / Filipino language switch
- Downloadable health record PDF generated in the browser
- Fully responsive: phone-style layout on mobile, website layout on desktop
- Data persistence via `localStorage`

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
# Python
python -m http.server 4173

# or Node.js
npx serve .
```

Then visit <http://localhost:4173>.

## Project structure

```
.
├── index.html      # App markup, icon sprite, modals
├── styles.css      # Design system and responsive layout
├── app.js          # Application logic, PDF generation, events
└── assets/
    ├── health-center.svg
    └── favicon.svg
```

## Deploy with GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the **main** branch and the **/ (root)** folder, then save.
5. Your site will be live at `https://<username>.github.io/<repo>/`.

All asset paths are relative, so the site works from a project subpath without changes.

## Notes

This is a demo project. Accounts, orders, and appointments are stored only in the browser's `localStorage` and are not sent to any server.
