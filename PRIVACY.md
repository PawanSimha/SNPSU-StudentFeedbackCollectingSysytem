# Privacy Policy

**Last updated:** July 2026

## 1. Data Controller

SOAS Feedback Collector is an open-source project operated under the authority of Sapthagiri NPS University, Bengaluru, Karnataka, India. The application is maintained by Pawan Simha R (MCA, SOAS) as part of an academic project.

## 2. What Data We Collect

### 2.1 Information you provide
- **Student accounts:** Name, USN (University Serial Number), email address, class group, and hashed password (bcrypt).
- **Feedback submissions:** Per-subject comments (50-300 characters).
- **Public feedback:** Subject, optional faculty name, and comments (100-300 characters) , no personal identity is collected for anonymous submissions.

### 2.2 Information collected automatically
- **No HTTP cookies:** This application does not set or read HTTP cookies.
- **Session storage:** JWT access tokens are stored in `sessionStorage` (cleared on tab close).
- **Local storage:** JWT refresh tokens, feedback draft state (`fb_drafts`), lock status (`fb_locked`), cookie consent preference (`cookie_consent`), and anonymized page-view events (`analytics_events`) are stored in `localStorage` for session continuity and app functionality. No tracking, advertising, or third-party analytics data is stored.

### 2.3 No third-party analytics
This application does **not** use Google Analytics, Plausible, or any third-party analytics service. No usage data is transmitted to external analytics providers. A built-in page-view tracker stores anonymized data locally in your browser only, subject to your cookie consent preference.

## 3. How We Use Your Data

- To authenticate students and administrators.
- To enable per-subject course feedback (comments only) with session-gated allotments.
- To display aggregated feedback statistics to administrators (individual identities are never exposed).
- To generate CSV/Word report exports for authorized administrators.
- To track which students have/have not submitted feedback per subject (coverage tracking).

## 4. Data Sharing

We do **not** sell, rent, or share personal data with third parties. Aggregated, anonymized feedback statistics may be shared with faculty for curriculum improvement.

## 5. Data Retention

- Student account data is retained while enrolled. Accounts may be removed upon request.
- Feedback submissions are retained for the duration of the academic term and may be archived thereafter.
- Anonymous public feedback cannot be linked to any individual and is retained for the duration of the academic term for audit purposes, after which it is anonymized or deleted.

## 6. Your Rights (GDPR / CCPA)

Depending on your jurisdiction, you may have the right to:
- **Access** personal data we hold about you.
- **Rectify** inaccurate data.
- **Delete** your account and associated data (contact the administrator).
- **Object** to processing.
- **Data portability.**

To exercise these rights, contact:  
**Sapthagiri NPS University**  
#14/5, Chamasandra, Bidarahalli Hobli,  
Bengaluru, Karnataka 560049, India  
or the project maintainer via the GitHub profile at [https://github.com/PawanSimha](https://github.com/PawanSimha).

## 7. Security

- Passwords are hashed using bcryptjs (salt rounds: 10).
- JWT tokens use a 30-day expiry and are transmitted over HTTPS in production.
- All database connections use standard MongoDB authentication.

## 8. Third-Party Services

- **Google Fonts:** The application loads the Inter and Lora font families from Google Fonts. Google's [privacy policy](https://policies.google.com/privacy) applies to font requests.
- **Hosting:** When deployed, the platform (Vercel) processes requests and may retain server logs per their respective policies.

## 9. Changes to This Policy

This policy may be updated periodically. Continued use of the application after changes constitutes acceptance of the updated policy.

## 10. Contact

Project maintainer: **Pawan Simha R**  
GitHub: [https://github.com/PawanSimha](https://github.com/PawanSimha)
