/**
 * Verifies Gmail SMTP credentials before you paste them into Supabase.
 *
 * Supabase deliberately hides delivery failures from the app (see
 * src/routes/forgot-password/+page.server.ts), so a bad app password looks
 * exactly like a working one from the browser. Run this first and you get the
 * real SMTP error instead of silence.
 *
 *   node --env-file=.env scripts/verify-smtp.mjs
 *   node --env-file=.env scripts/verify-smtp.mjs you@example.com
 *
 * Without an address it only opens and authenticates the connection.
 * With one it also sends a test message there.
 *
 * Never commit .env, and never paste the app password into chat or a ticket.
 */

import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST ?? 'smtp.gmail.com';
const port = Number(process.env.SMTP_PORT ?? 465);
const user = process.env.SMTP_USER;
const pass = (process.env.SMTP_PASS ?? '').replace(/\s+/g, ''); // Google shows the app password in 4 spaced groups.
const senderName = process.env.SMTP_SENDER_NAME ?? 'Tecnoesis 2026';
const to = process.argv[2];

const fail = (message, hint) => {
	console.error(`\n  FAIL  ${message}`);
	if (hint) console.error(`        ${hint}`);
	process.exit(1);
};

if (!user || !pass) {
	fail(
		'SMTP_USER and SMTP_PASS must be set.',
		'Add them to .env, then run with: node --env-file=.env scripts/verify-smtp.mjs'
	);
}

if (pass.length !== 16) {
	console.warn(
		`\n  WARN  SMTP_PASS is ${pass.length} characters after removing spaces; Google app passwords are 16.` +
			'\n        If this is your normal Gmail password it will not work - generate an app password instead.'
	);
}

console.log(`\n  host    ${host}:${port}`);
console.log(`  user    ${user}`);
console.log(`  secret  ${pass.length} chars (not shown)`);

const transporter = nodemailer.createTransport({
	host,
	port,
	secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS.
	auth: { user, pass }
});

try {
	await transporter.verify();
	console.log('\n  OK    Connected and authenticated.');
} catch (error) {
	const text = `${error?.response ?? ''} ${error?.message ?? ''}`;
	if (/535|BadCredentials|Username and Password not accepted/i.test(text)) {
		fail(
			'Gmail rejected the credentials (535).',
			'Check that 2-Step Verification is ON and that SMTP_PASS is a 16-character app password, not the account password.'
		);
	}
	if (/ETIMEDOUT|ECONNREFUSED|ENOTFOUND/i.test(text)) {
		fail(
			`Could not reach ${host}:${port}.`,
			'A firewall or campus network may block outbound SMTP. Try port 587, or test from another network.'
		);
	}
	fail(error?.message ?? 'Unknown SMTP error.', error?.response);
}

if (!to) {
	console.log('\n  Pass an address to also send a test message:');
	console.log('    node --env-file=.env scripts/verify-smtp.mjs you@example.com\n');
	process.exit(0);
}

try {
	const info = await transporter.sendMail({
		from: `"${senderName}" <${user}>`,
		to,
		subject: 'Tecnoesis SMTP test',
		text:
			'This is a test from scripts/verify-smtp.mjs.\n\n' +
			'If you are reading this, the app password works and Supabase can send password-reset email through it.'
	});
	console.log(`\n  OK    Sent to ${to} (id ${info.messageId})`);
	console.log('        If it does not arrive within a minute, check the spam folder.\n');
} catch (error) {
	fail(error?.message ?? 'Send failed.', error?.response);
}
