import type { Enquiry, Product } from "../types.js";

export interface Mailer {
  sendEnquiry(enquiry: Enquiry, product: Product): Promise<void>;
}
