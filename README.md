# Jamie's Simple Blog

A lightweight personal blog built with semantic HTML, modern CSS, and a tiny bit
of vanilla JavaScript. It features a landing page with recent posts, static post
pages, and dedicated about/contact pages—perfect for deploying to any static
site host.

## Project structure

```
.
├── index.html             # Homepage with dynamic list of posts
├── about.html             # Personal introduction
├── contact.html           # Ways to reach out
├── login.html             # Sign-in form for returning authors
├── forgot-password.html   # Password reset request flow
├── signup.html            # Registration form collecting username, email, phone, password
├── admin.html             # Admin dashboard mockup for managing users and posts
├── assets/
│   └── styles.css         # Global styling and design tokens
├── js/
│   ├── config.sample.js   # Placeholder Supabase credentials (copy to config.js)
│   ├── posts.js           # Post metadata consumed by the homepage
│   └── main.js            # Renders the post list and handles minor enhancements
└── posts/
    ├── building-a-delightfully-simple-blog.html
    ├── the-joy-of-well-crafted-developer-tools.html
    └── treat-side-projects-like-tiny-labs.html
```

## Getting started

Because the site is fully static, you can open `index.html` directly in a
browser. For a smoother development experience, serve it locally with any static
server—here's an example using Python:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000> to explore the blog.

## Customizing

* Update the author details in `index.html`, `about.html`, and `contact.html`.
* Add a new post by dropping an HTML file into `posts/` and updating `js/posts.js`.
* Tweak global styles inside `assets/styles.css` to match your brand.
* Adapt the auth pages (`signup.html`, `login.html`, `forgot-password.html`) and `admin.html` to wire them to your real backend. Each form already requests usernames, emails, phone numbers, and enforces complex 8+ character passwords where new credentials are created.
* To load posts from Supabase instead of the local `js/posts.js` list:
  1. Create a copy of `js/config.sample.js` named `js/config.js` and fill in your Supabase URL, anon key, and table name.
  2. Ensure your Supabase table (or view) exposes the columns `title`, `summary`, `slug` or `url`, `tags`, and `published_at` (or `date`).
  3. Grant `SELECT` to the anon role and enable Row Level Security policies so the anon key can read published posts only.
  4. Reload the homepage; it will attempt to fetch from Supabase first and fall back to the bundled posts if the request fails.

Happy writing!
