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
- All devices: submits the request directly to GatorOilServices@gmail.com through Web3Forms and shows a confirmation without leaving the page.


## Appointment form delivery (Web3Forms)

The booking form now sends directly through Web3Forms to `GatorOilServices@gmail.com`.

- Access key: stored in `business-config.js` as `web3FormsAccessKey`.
- Endpoint: `https://api.web3forms.com/submit`.
- The customer stays on the website while the request is sent.
- The page only shows **Request sent!** after Web3Forms returns a successful response.
- A hidden `botcheck` honeypot is included for basic spam protection.

If you ever regenerate the Web3Forms access key, replace only the value of `web3FormsAccessKey` in `business-config.js`.
