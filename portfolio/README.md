# Mohammad Rida Mahdi — Portfolio

My personal portfolio: full-stack developer, founder of **DivoTech**, and Data Science Intern at **AIAEC**.

The design uses the exact colours of the **2077** VS Code theme. When the page opens, a pointer clicks into a code window, the code types itself out, and the page builds around it.

- **Plain HTML, CSS and JavaScript.** No framework, no build step, nothing to install.
- **Responsive:** two columns on desktop, one column on phones.
- **Accessible:** keyboard focus styles, a skip link, and no animation for people who turn off motion in their system settings.

---

## Project structure

```
portfolio/
├── index.html            # All the content: about, experience, projects, skills, contact
├── assets/
│   ├── css/
│   │   └── style.css     # All styles (sections numbered 1–8 inside)
│   ├── js/
│   │   └── main.js       # Spotlight, active menu, intro animation
│   └── img/
│       └── favicon.svg   # Browser tab icon
├── .gitignore
└── README.md
```

## Run it locally

You don't need a server. Double-click `index.html` and it opens in your browser.

If you'd rather use VS Code, install the **Live Server** extension, right-click `index.html`, then choose **Open with Live Server**. The page reloads every time you save.

## Put it on GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/mohamadridamahdi/portfolio.git
git push -u origin main
```

(First create an empty repository called `portfolio` on GitHub. Don't add a README there, because this project already has one.)

## Publish it for free with GitHub Pages

1. On GitHub, open the repository, then **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then click **Save**.
4. After about a minute the site is live at:
   `https://mohamadridamahdi.github.io/portfolio/`

> Tip: name the repository `mohamadridamahdi.github.io` and the site will live at `https://mohamadridamahdi.github.io/`, without `/portfolio` at the end.

**Or use Vercel:** import the GitHub repository at vercel.com, leave all the settings as they are (it's a static site), and click **Deploy**.

## How to edit things

| I want to change… | Where |
|---|---|
| Text, jobs, projects, skills | `index.html`. Each section starts with `<section id="...">` |
| Colours | The `:root` variables at the top of `assets/css/style.css` |
| The code in the editor window | The `<pre>` block inside `<figure class="ed">` in `index.html` |
| How fast the code types | `const dur = 1700` in `assets/js/main.js` (in milliseconds) |
| Add a résumé button | Put your CV at `assets/Mohammad_Rida_Mahdi_CV.pdf`, then uncomment the line marked in `index.html` |

## How the intro animation works

1. A tiny script in `<head>` runs before the page appears. It adds the `anim` class to the page (unless the visitor turned off motion) and the `intro` class (on the first visit of the session only).
2. While those classes are on, the CSS keeps each section invisible, shifted 14px down.
3. `main.js` empties the code text, moves a drawn pointer into the code window, and then puts the text back a few characters on every screen refresh. That's the typing effect.
4. At the same time, the left-side pieces get the `in` class one by one, so they fade up into place.
5. Everything further down uses an `IntersectionObserver`, which tells the script when an element scrolls into view, and it fades in at that moment.
6. Any click, key press or scroll calls `finish()`, which shows everything at once.

## Credits

- Colours: [2077 theme](https://marketplace.visualstudio.com/items?itemName=Endormi.2077-theme) by Endormi
- Layout inspired by [Brittany Chiang](https://brittanychiang.com)'s portfolio
- Fonts: [Inter](https://rsms.me/inter/) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/), loaded from Google Fonts

---

**Contact:** mohamadridamahdi@gmail.com · [GitHub](https://github.com/mohamadridamahdi) · [LinkedIn](https://www.linkedin.com/in/mohamad-rida-mahdi-0028a8349/)
