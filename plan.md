# Minimal Redesign Plan

Branch: `minimal-redesign` (created from `main` at `582d113`)
Status: **In progress. Steps 2 to 6 done. Waiting on your review and Buttondown username (Step 6b)**

The live site (`main`) does not change until this branch is merged.

---

## 1. Goal

Replace the current tabbed, card-heavy portfolio with a minimal, text-first site inspired by destraynor.com:

- A short, human "who I am" intro with a photo
- A short work history (Experience) list
- A few short testimonials (strongest only)
- A "Join Chibuike on the waitlist" sign-up
- A home page that is only the intro (and the sign-up). The other pages are reached through links written into the intro text, like Des's site
- Each list page shows plain items: title, date, one-line summary, a link, and an image, alternating left and right

**Success measure:** a visitor knows who you are within 5 seconds, can reach any project or article in one click, and can join the waitlist without leaving the home page.

---

## 2. Reference design (from the screenshots)

| Element | What the reference does | What we will do |
|---|---|---|
| Home | Tall photo on the left, two short paragraphs on the right, links written into sentences, no nav bar | Same. Photo on the left, short intro on the right with links to the other pages, sign-up below the intro, no nav bar |
| Nav (other pages) | 4 plain text links at the top, centered, underlined, current page in accent color | Same. Shown on Projects, Writing, and Experience pages only, plus your name linking back home |
| List pages | Big centered page title, items alternate image left/right, title in accent color, date in italics, one-line summary, "Read this essay" link | Same layout. "View project" / "Read article" links |
| Type | Serif headings, readable body, large line spacing | Serif headings + clean body font from Google Fonts (proposal: Alegreya + Alegreya Sans) |
| Color | White background, one accent color (pink-red), blue links, thin yellow edge on home | White background, one accent color, one link color, one thin edge strip. Your own colors, not a copy |
| Decoration | Dashed curvy line between list items | Optional, see question Q7 |

---

## 3. Site structure (proposed)

**Home page is the intro only. Every other page is a separate page linked from the intro text.**

```
index.html        Home: photo left, intro right (links to the pages below), newsletter sign-up
projects.html     Projects: 12 items, image + text alternating left/right
writing.html      Writing: articles, same layout
experience.html   Experience: 4 roles, education line, 2 testimonials, full resume (PDF) link

assets/css/minimal.css             New stylesheet shared by all pages (one file)
assets/ONUBA CHIBUIKE RESUME.pdf   Linked from the Experience page and the intro
```

How the pages connect:

- **Home** has no nav bar. Its intro sentences link to Projects, Writing, Experience, the resume PDF, and your socials (like "you've read some of my writing" on Des's site).
- **Other pages** have the small top nav: Chibuike (back home) · Projects · Writing · Experience. The current page shows in the accent color.
- No JavaScript needed except whatever Buttondown's form requires (likely none, a plain HTML form works).
- Old `assets/css/style.css` and `assets/js/script.js` stay in the repo until the final cleanup step, so nothing breaks mid-way.

### What is removed from the site

Confirmed by you (Q4):

- Sidebar, tabs, "What I do" services cards
- Testimonials carousel and avatars (2 strongest quotes kept as plain text, see below)
- Certifications carousel (HBS Aspire kept as one line under Education)
- Technical Skills section (skills show through projects; full list stays in the resume PDF)
- Contact form (it currently has `action="#"` so it does not send anything)
- Google Map embed
- Phone number and birthday (recommend removing from a public page for privacy)
- Floating "Download Complete Resume" button (replaced by a resume link in the intro and on the Experience page)

### What is kept

- All 12 projects with their images, summaries, and GitHub / demo links
- All 6 articles with their images and links
- **Work history** on the home page as a plain list: role, company, dates, one line each, then "Full resume (PDF)" link
- **Education** as one line: University of Nigeria, Nsukka (Computer Science) + HBS Aspire Leaders Program
- **2 testimonials** as plain text with name and title, no avatars, no carousel:
  - Jon Wayland, Data Science Director, Florida Blue (trim the "freshly graduated" part)
  - Vidura Bandara Wijekoon, Sri Lanka Chapter Lead, OmdenaAI
- Links to LinkedIn, GitHub, Twitter, email, and Calendly (written into the intro text or a small footer line)

---

## 4. Content inventory (from current `index.html`)

### Projects (12)

| # | Title | Link | Image |
|---|---|---|---|
| 1 | ETL Pipeline Silent Failure Detection | GitHub | etlfailure.png |
| 2 | Document chunking and vector embedding pipeline | GitHub | ingestion.png |
| 3 | FastAPI blog API with JWT auth | GitHub | fastapi.png |
| 4 | askDB: natural language to SQL | GitHub | askdb.gif |
| 5 | Condition Classification and Drug Recommendation | **No link** ("In production") | Patient Condition Classification.png |
| 6 | ReviewScope: customer review dashboard | GitHub | review.png |
| 7 | Driver Drowsiness Detection | GitHub | driver.png |
| 8 | Autism Detection in Toddlers | Live demo | autism 2.png |
| 9 | Diabetes Prediction | GitHub | diabetes_image.jpg |
| 10 | LB Editor (photo editor) | GitHub | editor.png |
| 11 | Diamond Quality/Price Classifier | GitHub | diamond.jpg |
| 12 | Mall customer segmentation | GitHub | mall.jpg |

Note: projects have **no dates** today. See Q6.

### Intro (draft, you will edit)

> Hey! I'm **Chibuike**. I'm a data scientist and AI engineer based in Port Harcourt, Nigeria. Day to day, I'm a Customer Success Manager at [Thera](https://www.getthera.com) (YC S22), where I handle technical operations: I built our AI support assistant and automate the workflows that keep customers and the product team in sync.
>
> Outside work, I build things with NLP, LLMs, and machine learning, mostly with healthcare data and messy text. You can browse [my projects](projects.html), read [my writing](writing.html), see [where I've worked](experience.html) (or grab [my resume](assets/ONUBA%20CHIBUIKE%20RESUME.pdf)), or find me on [LinkedIn](https://www.linkedin.com/in/chibuikeonuba/), [GitHub](https://github.com/ChibuikeOnuba), and [Twitter](https://twitter.com/chibuike_heis). Want to build something together? [Email me](mailto:onubawinner042@gmail.com) or [book a call](https://calendly.com/onubawinner042/get-to-know-me).

Placement: home page, right of the photo. The newsletter sign-up sits directly under these two paragraphs.

### Newsletter sign-up (wording options)

- Heading: "Get updates when I add new projects" (recommended) or "Join the list"
- One line: "An occasional email when I publish a new project or article. No spam, unsubscribe anytime."
- Fields: email + button ("Join")

### Experience (4)

| Role | Company | Dates | One line (draft, you approve) |
|---|---|---|---|
| Customer Success Manager | Thera (YC S22) | Jan 2025 to present | Runs technical operations: AI support assistant, workflow automation, customer data |
| Freelance Data Scientist | Upwork | Jan 2020 to Jan 2025 | ML, predictive modeling, and data visualization for clients |
| Data Analyst | Transorp | May 2023 to Oct 2023 | Procurement analytics and supplier evaluation |
| Data Scientist | OmdenaAI | Jan 2023 to May 2023 | Autism prediction model with a 50+ person team; published research |

### Writing (6)

| # | Title | Date | Link |
|---|---|---|---|
| 1 | Getting Started with LangChain for LLMs | Dec 9, 2024 | Medium |
| 2 | Patient Condition Classification Using Drug Reviews | Aug 27, 2024 | **Broken (`#`)** |
| 3 | Driver Drowsiness Detection using Computer Vision | Mar 30, 2024 | GitHub |
| 4 | VADER vs RoBERTa | Feb 23, 2024 | Medium |
| 5 | Parts of Speech Tagging with NLP | Jan 12, 2024 | GitHub PDF |
| 6 | ML Approach to Autism Detection in Toddlers | Nov 13, 2023 | Medium |

---

## 5. Steps and progress tracker

Each step ends with a check-in with you before moving on.

- [x] **Step 0.** Create branch `minimal-redesign`
- [x] **Step 1.** Write this plan. Approved, defaults accepted for Q5, Q6, Q7, Q9
- [x] **Step 2.** Base styles: `assets/css/minimal.css` (Alegreya fonts, color tokens, light + dark mode, home, nav, list, experience, mobile)
- [x] **Step 3.** Home page: `index.html` rebuilt. Photo converted from `winner.HEIC` to `assets/images/portrait.jpg` (1179x1400, TV cropped out). Checked at desktop and phone width, light and dark mode. Sign-up form is a placeholder (does not submit yet)
- [x] **Step 4.** Projects page: `projects.html`, 12 items, tech stack in the date spot, "In production" project kept without a link
- [x] **Step 5.** Writing page: `writing.html`, 5 articles (broken-link article dropped), dates shown, "on Medium" link in header. Summaries are short rewrites of the old excerpts, please review
- [x] **Step 6.** Experience page: `experience.html`, 4 roles (no Thera metrics), education, 2 trimmed testimonials with `[...]` marking cuts, resume link. Checked desktop + phone, all image paths verified
- [x] **Step 6a.** Changes after review: new photo (`winner 2.jpg` saved as compressed `portrait.jpg`), home text centered. Projects: added Probe (live site screenshot as image) and CertainML (placeholder), "More details" toggles (native `<details>`, no JS) on Probe, ETL, Condition Classification, askDB. Fixed ETL and askDB tech stacks to match their READMEs
- [ ] **Step 6c.** CertainML: needs a description from you (repo is private, could not read it). Replace placeholder image `project-1.jpg`
- [ ] **Step 6b.** Newsletter: connect the home page sign-up to Buttondown and test a real sign-up (blocked until you share your Buttondown username)
- [ ] **Step 7.** Mobile and polish: check at phone width, image sizes, link checks, page titles, favicon
- [ ] **Step 8.** Review: you preview locally (Live Server), we fix anything you flag
- [ ] **Step 9.** Cleanup: delete unused old CSS/JS/images (only after you confirm), delete `plan.md`
- [ ] **Step 10.** Push branch, open a PR into `main`, you review and merge when ready

---

## 6. Risks and dependencies

- **Waitlist needs a third-party service.** GitHub Pages only serves static files and cannot store emails. We need a free form or newsletter service (Q2). Emails collected there are personal data, so pick a service you are comfortable holding them.
- **Photo shape.** The reference uses a tall portrait photo. Your current `winner.jpg` is a 652x652 square, which will look small or cropped in a full-height layout (Q3).
- **Broken / missing links.** Writing item #2 links to `#`, and project #5 has no link. Decide whether to keep them (Q5).
- **Job title.** Decided: use the official title "Customer Success Manager" and describe the technical ops work in the description line. Do not relabel the title itself, since recruiters and background checks compare against employer records.
- **Employer metrics.** The current site publishes Thera internal numbers (about 50% faster responses, 30% lower early churn risk, 12+ hours saved per month). Confirm with your manager that Thera is fine with these being public before carrying them over. Until confirmed, the Experience line uses no numbers.
- **Existing branches.** `ai-redesign` and `new-design` exist on GitHub. This plan starts fresh from `main` and ignores them.

---

## 7. Questions for you

**Q1. What is the waitlist for?** ✅ Answered: collect emails to send updates when the portfolio changes (a newsletter). Wording options in section 4.

**Q2. Which service should collect waitlist emails?**
Options (all have free tiers):
- **Formspree:** simple form, emails go to your inbox
- **Buttondown / Substack / Beehiiv:** proper newsletter tool, you can email subscribers later
- **Google Form:** easiest, but looks less polished
- **Tally:** clean embeddable form

My recommendation: Buttondown if this is a newsletter, Formspree if it is a simple list.

✅ Recommended: **Buttondown** (it stores emails and lets you send updates). **Your action:** create a free Buttondown account and share your username. Step 4 is blocked until then; Steps 2, 3, 5, 6 can proceed.

**Q3. Photo.** ⏳ You will add it to `assets/images/` and share the filename. Do you have a taller portrait photo (ideally at least 900px wide, 1200px+ tall, candid rather than a formal headshot)? If not, I will design around the square `winner.jpg`.

**Q4. Removals.** ✅ Answered: same purpose as the original site, minimal. Keep work history, keep the 2 strongest testimonials as plain text, drop the rest listed in section 3.

**Q5. Broken items.** Keep or drop Writing #2 (Patient Condition Classification, link is `#`) and Project #5 (no link)?

**Q6. Project dates.** The reference shows a date on each item. Do you want to add dates (month + year) to projects, or show tech stack in that spot instead?

**Q7. Decoration.** Keep the dashed curvy line between list items, or leave it out for maximum minimalism?

**Q8. Intro.** ✅ Title answered: Customer Success Manager at Thera, with technical ops in the description. Intro: ✅ drafted in section 4, you will edit later.

**Q9. Pages and nav.** Proposed pages: Projects, Writing, Experience (testimonials live on Experience). Nav on those pages: Chibuike (home) · Projects · Writing · Experience. Anything to add or remove?

**Q10. Accent color.** ⏳ Proposed in Step 2: burnt orange `#c2410c` for names and titles, teal `#0b6e8a` for links, amber `#f2b33d` edge strip (picked to match the warm wall in your photo). Change in `:root` of `minimal.css`.

**Q12. Thera link.** The intro links "Thera" to `https://www.getthera.com`. Confirm that is the right public URL.

**Q13. Original photo.** `assets/images/winner.HEIC` (1.8 MB) is not tracked by git. Recommend not committing it, since browsers cannot show HEIC and `portrait.jpg` replaces it.
