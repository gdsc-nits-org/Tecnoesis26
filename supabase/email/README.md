# Sending auth email through Gmail SMTP

Supabase's built-in email sender only delivers to addresses on your Supabase
organisation's team and is capped at **2 emails per hour**. That is why
`/forgot-password` reports success but no student ever receives a link: the app
code is fine, the mail never leaves Supabase. Configuring custom SMTP fixes it.

These steps use `tecnoesisweb3d@gmail.com` with a Google **app password**.

> **Which emails does this actually affect?** Only **Reset Password**. Accounts
> are created through Google OAuth, which arrives pre-verified, so Supabase
> never sends a confirmation, magic-link, invite or change-email message in this
> project. Password recovery is the one flow that depends on SMTP.

---

## 1. Create the Google app password

App passwords only exist on accounts with 2-Step Verification switched on.

1. Sign in as `tecnoesisweb3d@gmail.com` and open
   [myaccount.google.com/security](https://myaccount.google.com/security).
2. Turn on **2-Step Verification** if it is not already on. Without it, the app
   password page returns "the setting you are looking for is not available".
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
4. Enter a name such as `Supabase Tecnoesis` and select **Create**.
5. Copy the 16-character password. Google displays it as four groups of four —
   **the spaces are display only, remove them.**

Treat this string like a password for the whole mailbox. It bypasses 2FA. Put it
in `.env` and nowhere else: not in Git, not in a chat message, not in a ticket.
You can revoke it from the same page at any time, which is what you should do if
it ever leaks.

## 2. Verify it before touching Supabase

Add to `.env` (already listed in `.env.example`):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tecnoesisweb3d@gmail.com
SMTP_PASS=your16charapppassword
SMTP_SENDER_NAME=Tecnoesis 2026
```

Then check the credentials authenticate, and send yourself a real test:

```bash
node --env-file=.env scripts/verify-smtp.mjs
```

```bash
node --env-file=.env scripts/verify-smtp.mjs your.name@civil.nits.ac.in
```

Do this first. Supabase intentionally hides delivery errors from the browser, so
a wrong app password there is invisible — you would just see "check your inbox"
forever. The script prints the actual SMTP error instead.

These `SMTP_*` values are **only** used by that script. The running app does not
read them; Supabase holds the real configuration.

## 3. Configure SMTP in Supabase

Dashboard → **Project Settings → Authentication → SMTP Settings** (on newer
dashboards: **Authentication → Emails → SMTP Settings**). Enable custom SMTP and
set:

| Field        | Value                                    |
| ------------ | ---------------------------------------- |
| Sender email | `tecnoesisweb3d@gmail.com`               |
| Sender name  | `Tecnoesis 2026`                         |
| Host         | `smtp.gmail.com`                         |
| Port         | `465`                                    |
| Username     | `tecnoesisweb3d@gmail.com`               |
| Password     | the 16-character app password, no spaces |

Save. If your host blocks port 465, use `587` instead — set `SMTP_PORT=587` in
`.env` too so the verification script tests the same path.

The sender address must match the SMTP username. Gmail rewrites a mismatched
`From` header, which breaks alignment and lands mail in spam.

## 4. Raise the email rate limit

Dashboard → **Authentication → Rate Limits → Rate limit for sending emails**.

With custom SMTP this defaults to **30 per hour**, which is low for a fest. Gmail
allows roughly 500 messages per day, so something in the range of 100–150 per
hour is a reasonable ceiling that stays well inside Google's limit.

There is also a **minimum interval between emails** setting. Keep it modest (a
few seconds) so a student who mistypes an address is not locked out for a minute.

## 5. Check the redirect allowlist

Dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://tecnoesis.co.in`
- **Redirect URLs**: add both
  - `https://tecnoesis.co.in/**`
  - `http://localhost:5173/**`

The recovery link returns to `/auth/callback?next=/reset-password`, so the
allowlist has to cover that path _with its query string_. The `/**` wildcard
does; an exact `https://tecnoesis.co.in/auth/callback` entry does not.

## 6. Install the email template

Dashboard → **Authentication → Emails → Reset Password**. Paste the contents of
[`reset-password.html`](./reset-password.html) into the message body, and set the
subject to something like `Reset your Tecnoesis password`.

Keep `{{ .ConfirmationURL }}` exactly as written. Replacing it with the Site URL
or a bare `/reset-password` link is the single most common way to break recovery.

## 7. Test end to end

1. Open `/forgot-password` and submit a **real** institute address that has an
   account.
2. The message should arrive within a minute. Check spam on the first send.
3. Open the link **in the same browser** that requested it. The flow uses PKCE
   and keeps its verifier in a browser cookie, so a link opened in a different
   browser — or in an email app's built-in preview window — will fail.
4. Set a new password. The app signs you out and returns to `/login?reset=success`.
5. Log in with the username and the new password, and confirm the old one fails.

If nothing arrives, look at **Authentication → Logs** in the dashboard. That is
where the real SMTP error surfaces; the app deliberately will not show it, to
avoid revealing which addresses have accounts.

---

## Known limits of this setup

Gmail is fine for password resets and poor for anything bulk:

- **~500 messages per day** on a free Gmail account, and Google throttles bursts.
- Sustained volume can get the mailbox **temporarily locked for spam**, which
  would take down password recovery along with it.
- Revoking or regenerating the app password silently breaks sending until the
  new value is saved in Supabase.

If Tecnoesis later sends announcements, result mails or anything to the whole
participant list, move to a transactional provider — Resend, Brevo, SendGrid and
Amazon SES all have free tiers well above this, and give you delivery logs. Only
steps 3 and 4 change; the template and the app stay as they are.
