import { createTransport } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const MAIL_FROM = import.meta.env.MAIL_FROM;
const MAIL_HOST = import.meta.env.MAIL_HOST;
const MAIL_PASSWORD = import.meta.env.MAIL_PASSWORD;
const MAIL_PORT = import.meta.env.MAIL_PORT;
const MAIL_USER = import.meta.env.MAIL_USER;

if (!(MAIL_FROM && MAIL_HOST && MAIL_PASSWORD && MAIL_PORT && MAIL_USER)) {
  throw new TypeError(
    "Mail system credentials are missing; the mailer cannot be created."
  );
}

const config: SMTPTransport.Options = {
  host: MAIL_HOST,
  port: +(MAIL_PORT || 587),
  secure: MAIL_PORT == "465",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
};

const transport = createTransport(config);

export async function send(
  options: Omit<Mail.Options, "from"> & {
    subject: unknown;
    text: unknown;
  } & ({ to: unknown } | { cc: unknown } | { bcc: unknown })
) {
  const info = await transport.sendMail({
    ...options,
    from: MAIL_FROM,
  });

  console.log(info);
}
