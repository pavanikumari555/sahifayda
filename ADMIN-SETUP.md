# SahiFayda admin — setup and operating notes

Date: 27 October 2026. Website publication remains deferred; only the requested Supabase admin backend has been deployed.

## Admin address and account

- Local: http://127.0.0.1:3102/admin (also available on port 3100).
- Planned live path: `/admin` on the eventual chosen domain.
- Owner username: `singhal`.
- Owner recovery/login email: `homemoneycalc.site@gmail.com`.
- Owner password was entered by the user directly in Supabase, never shared in chat, source or frontend configuration. Supabase Auth identity and email confirmation were verified, and the intended owner account was linked.
- The login form has only username and password. It does not expose the recovery email publicly.

## What the panel implements

1. **Overview:** actual service states and enabled admin counts.
2. **Tools & availability:** active, paused, hidden and restore; editable English/Hindi unavailable messages. Public calculators check live status before execution; hidden services are removed from normal discovery after availability loads. Live SIA cannot be activated before its provider/runner setup.
3. **Users & access:** owners can create managers or additional owners and enable/disable other accounts. Managers cannot grant access. The last enabled owner cannot be disabled, and the current account cannot disable itself. No permanent account deletion is offered.
4. **My account:** change password; request a verified change of the recovery/login email. Username stays constant across an email change.
5. **Activity:** last 30 recorded service/account/session events. Passwords, access tokens and API keys are not logged.
6. **SIA & APIs:** truthful connection state. Supabase Auth, admin backend and database controls are connected; live Groq/Gemini AI is not configured.
7. **Content & marketing:** a link to the existing six design drafts and an explicit statement that a guide CMS/rebuild editor and channel publishing are not connected yet. These are not fake editing/publishing controls.

## Team account workflow

- The owner confirms their current password before creating another account or changing access.
- New account fields: username, verified-with-the-person email, role, temporary password and the owner's current password.
- The provider account is provisioned by the owner; the owner must verify the email with the intended person before adding access. No invitation email is automatically sent by this form.
- The owner shares temporary credentials through their own appropriate private channel. The new manager must change the temporary password before using management operations.
- Disabling access is enforced on new API/database requests even if an old JWT has not expired. Already-completed operations or already-read information are not undone.

## Security implementation

- Supabase Edge Function `admin-console`, own authentication for every action. Gateway `verify_jwt` is false because username/password login has no user JWT; this is not a public admin bypass. Except for login/preflight, a verified Supabase user, active admin membership and live session are required. Public/unknown-user requests were verified to return HTTP 401.
- Allowed browser origins currently restricted to localhost/127.0.0.1 ports 3100 and 3102. Set server-side `ADMIN_APP_ORIGIN` to the approved HTTPS website origin before release and review whether development origins should remain allowed.
- Privileged Supabase keys exist only in the Edge Function's provider-managed environment. The frontend sends only the public project key and an in-memory access token after sign-in.
- Native Auth password verification, ten login/reauthentication attempts per account per five minutes, generic failure messages, bounded body size and no raw upstream-error exposure.
- No refresh token or access token is saved to localStorage. A page refresh requires login again. Sessions are restricted to a maximum 30-minute authentication age by the backend/database checks; logout revokes the current Auth session.
- New/changed passwords must be 12–256 characters. An existing shorter owner password routes to a required password change after valid login. Use a unique password; this length check is not a complete breached-password detector.
- Email/access/password changes require current-password verification. Provider confirmations apply to email changes. There is no silent email takeover route in the panel.
- Database RLS and private authorization helpers separate authentication from permission. Ordinary authenticated users cannot provision admin accounts, forge logs or invoke privileged management/rate-limit functions.
- Admin HTML is noindex/nofollow and no-store; no admin URL is included in the public sitemap. The location `/admin` is intentionally conventional; security comes from authentication and authorization, not a hidden path.

## Provider email/recovery configuration — remaining dependency

The change-email API is implemented, but a complete email recovery/return journey depends on actual Supabase Auth URL configuration and email delivery. These provider settings have not been changed through the available connector.

Before using email recovery/change in a public release, configure and verify:

- [Auth URL configuration](https://supabase.com/dashboard/project/xkkmjuqziqrpggtgxlxc/auth/url-configuration): approved Site URL and `/admin` return URL. During local testing use the intended localhost:3102 site/admin return; production must use the chosen real HTTPS domain.
- Email delivery to the intended team/recovery addresses. Supabase's default mail service can have recipient/rate restrictions; verify the real account settings. Custom SMTP may be required for the intended recipients/production flow; no SMTP subscription, credential or paid plan was added here.
- Native confirmation requirements for changing an address. Displaying a pending email is not proof that it has changed. Confirm using the provider emails and verify the current email in My account.
- A dedicated password-forgotten/reset UI has not been added in this first panel. The provider's dashboard/recovery settings remain the fallback until a reviewed recovery flow is configured and tested.

## Remaining Supabase advisory

The database policy advisory was addressed. One provider warning remains: leaked-password protection is disabled. Official Supabase docs place this feature on Pro and higher plans. The project remains Free; no paid upgrade was performed. [Supabase password security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## API integration order

- Connected now: Supabase Auth, admin API, tool states, roles and activity records.
- Next: choose/authorize an eligible Groq/Gemini provider, enter keys through provider/server secrets, configure reviewed knowledge, quota/budget limits and execution pause checks, then test public nonpersonal tasks before activating live SIA.
- No AI provider key, model invocation, automatic marketing, payout or financial action is active. Private financial inputs must not be submitted to unpaid Gemini.

## Verification

- Thirteen local calculation/security/admin-authorization tests passed.
- Static build and CSP/export checks passed, including the /admin route.
- Live backend rejects unauthenticated dashboard and unknown username login (401).
- Database checks: public account read, authenticated admin insertion, forged audit insertion and unauthorized privileged-function execution are denied.
- Browser owner-login and control acceptance results are recorded in the current checkpoint after user-entered credentials; never copy a password/token into this document.

Sources: current connected Supabase Auth/Edge Function/RLS documentation and actual provider responses, including [password sign-in](https://supabase.com/docs/reference/javascript/auth-signinwithpassword), [function configuration](https://supabase.com/docs/guides/functions/function-configuration) and [Auth email templates/return URLs](https://supabase.com/docs/guides/auth/auth-email-templates).
