Final Submission

this contains two files:

handyc-app-backend : strapi and backend handyc-app-frontend: next.js and my app

Strapi Admin UI

URL: http://localhost:1337/admin

Super Admin:

Email: admin@example.com

Password: AdminPass123

Registration Page: http://localhost:3000/register

Sample Data:

  First Name: Demo
  
  Last Name: User
  
  Birthday: 1985-01-15
  
  Language: English
  
  Disability Card Number: DM123456
  
  Issuing Date: 2025-01-01
  
  Expiry: 2026-01-01
  
  Attached File: sample_card.pdf
  
  Features
Register a new user on the frontend.

After login, view events at /events?locale=de for German or /events?locale=en for English.

Change the locale query parameter or use the language selector to switch languages.

Click an event to view details,

after choosing an event in whatever lang u chose u will be direct for example to http://localhost:3000/events/14?locale=de
