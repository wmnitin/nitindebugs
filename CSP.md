# CSP — Content Security Policy

CSP is a **browser security layer** that controls which resources your website can load or execute.

It helps reduce risks like **XSS and malicious resource injection**.

---

## Why do companies use it?

Because modern websites load:

**JS • CSS • Images • Fonts • APIs • Iframes**

CSP lets us define **where each resource is allowed to come from**.

---

## 2 Ways to Add CSP

### 1. HTTP Header — Recommended

```http
Content-Security-Policy: default-src 'self'; script-src 'self';
```

### 2. HTML Meta Tag

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self';"
/>
```

**HTTP Header is preferred.**

---

## Resource Mapping

| Resource | Directive |
|---|---|
| JS | `script-src` |
| CSS | `style-src` |
| Images | `img-src` |
| Fonts | `font-src` |
| API / WebSocket | `connect-src` |
| Iframe | `frame-src` |
| Video / Audio | `media-src` |

---

## Example

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' https://cdn.example.com;
  font-src 'self' https://fonts.example.com;
  connect-src 'self' https://api.example.com;
```

**CSP = Tell the browser what is allowed, and where it is allowed from.**