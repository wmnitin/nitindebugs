# CSR vs SSR vs SSG

## CSR — Client-Side Rendering

Browser receives:
HTML + JavaScript

Browser:
JavaScript → API → Render UI

**Remember:** Browser renders the page.


## SSR — Server-Side Rendering

Browser → Server

Server:
Fetch Data → Generate HTML → Send to Browser

**Remember:** Server renders on every request.


## SSG — Static Site Generation

Build Time:
Data → Generate HTML → Deploy

User:
Request → Already generated HTML

**Remember:** HTML is generated before the user requests it.


# Quick Comparison

|        | CSR | SSR | SSG |
|--------|-----|-----|-----|
| Rendered by | Browser | Server | Build |
| When | Client | Request | Build time |
| Best for | Web apps | Dynamic pages | Blogs / Docs |