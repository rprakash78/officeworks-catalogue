import nodemailer from "nodemailer";
import type { Enquiry, Product } from "../types.js";
import type { Mailer } from "./mailer.js";

export type SmtpConfig = {
  host: string;
  port: number;
  from: string;
  salesInbox: string;
};

export class SmtpMailer implements Mailer {
  private readonly transport: nodemailer.Transporter;

  constructor(private readonly config: SmtpConfig) {
    this.transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false,
    });
  }

  async sendEnquiry(enquiry: Enquiry, product: Product): Promise<void> {
    const phoneLine = enquiry.phone ? `\nPhone: ${enquiry.phone}` : "";
    try {
      await this.transport.sendMail({
        from: this.config.from,
        to: this.config.salesInbox,
        replyTo: enquiry.email,
        subject: `Product enquiry: ${product.title} (#${product.id})`,
        text: [
          `A customer has enquired about ${product.title} (id ${product.id}).`,
          "",
          `Name: ${enquiry.name}`,
          `Email: ${enquiry.email}${phoneLine}`,
          "",
          "Message:",
          enquiry.message,
        ].join("\n"),
      });
    } catch {
      throw Object.assign(
        new Error("Failed to send enquiry email. Is Mailpit running?"),
        { status: 502 },
      );
    }
  }
}
