import { MAILER_EMAIL, MAILER_PASSWORD } from '$env/static/private';

export type MailInput = {
	to: string;
	subject: string;
	text?: string;
	html?: string;
};

export async function sendMail({ to, subject, text, html }: MailInput): Promise<boolean> {
	if (!MAILER_EMAIL || !MAILER_PASSWORD) {
		console.warn('Mailer credentials are not configured. Skipping email.');
		return false;
	}

	try {
		const nodemailer = await import('nodemailer');

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: MAILER_EMAIL,
				pass: MAILER_PASSWORD
			}
		});

		await transporter.sendMail({
			from: MAILER_EMAIL,
			to,
			subject,
			text,
			html
		});

		return true;
	} catch (err) {
		console.error('sendMail failed:', err);
		return false;
	}
}
