# Gator Mobile Oil Services — Website Base

This version is already personalized with the business information supplied on August 15, 2026.

## Already configured
- Business: Gator Mobile Oil Services
- Phone: (352) 933-5038
- Brand colors: green, black and white
- Areas: The Villages, Leesburg, Fruitland Park and surrounding areas
- Services: Oil Change, Brakes, Spark Plugs, Battery, Air Filter & Cabin Filter
- Hours: Mon–Fri 4 PM–11 PM; Sat 8 AM–8 PM; Sun 8 AM–5 PM
- Social handle: @gatoroilservices on Instagram, Facebook and TikTok
- Booking behavior: customers fill out the form and tap Send Request; their phone opens a pre-filled text message to Gator at (352) 933-5038. The customer still sends the message manually.

## Still needed before launch
1. Real business photos to replace `assets/hero.jpg`.
2. Confirm whether the official public-facing name should be “Gator Mobile Oil Services” or the logo wording “Gator Mobile Oil Change LLC”.
3. Confirm the exact Facebook URL if the `facebook.com/gatoroilservices` vanity URL is different.
4. Optional: service prices or “starting at” prices.
5. Optional: testimonials/reviews and before/after photos.
6. Optional: business email if you want email contact in addition to call/text.

## Main files
- `index.html` — content and sections
- `style.css` — design and responsive layout
- `business-config.js` — phone, hours, social links, service area, colors
- `main.js` — mobile menu, animations, service selection and SMS appointment request
- `assets/gator-mascot.jpg` — cropped mascot from supplied logo
- `assets/logo-source.jpeg` — original supplied logo
- `assets/hero.jpg` — placeholder hero photo; replace later


## Appointment form behavior

- Phones/tablets: opens the customer's SMS app with the request pre-filled to (352) 933-5038.
- Desktop/laptop: submits the request directly to GatorOilServices@gmail.com using FormSubmit's AJAX endpoint and shows a confirmation without leaving the page.
- IMPORTANT: FormSubmit requires a one-time email activation. After the first desktop test submission, open GatorOilServices@gmail.com and click the FormSubmit activation/confirmation link. Until that is confirmed, live submissions will not be delivered normally.


## FormSubmit one-time setup (v11)

This version is prepared for FormSubmit's **Invisible Email** identifier.

1. Upload `index.html`, `main.js`, and `business-config.js` to GitHub.
2. Open the live site at `https://gatoroilservices.github.io/gatoroil/` and submit one test request.
3. Open the FormSubmit activation email sent to `GatorOilServices@gmail.com` and confirm it.
4. In the confirmation/activation email, copy the random-like **Invisible Email** string FormSubmit provides.
5. Open `business-config.js` and replace:

```js
formSubmitId: "",
```

with:

```js
formSubmitId: "PASTE_THE_RANDOM_STRING_HERE",
```

6. Upload only `business-config.js` again.

Do not paste the full `https://formsubmit.co/...` URL into `formSubmitId`; paste only the random string.

When the website moves to a custom domain, also change `formUrl` to the final HTTPS URL.
