// Phone number helpers shared by the public forms and the admin CRM.
//
// wa.me only understands a full international number written as bare digits —
// no +, no spaces, no trunk 0: wa.me/254712345678. Stripping the punctuation is
// not enough on its own: a Kenyan number stored as "0712345678" becomes
// wa.me/0712345678, which is a dead link.

// Numbers stored without any country code are treated as local. Kenya is the
// home market; contacts abroad save theirs with a + and a country code.
const DEFAULT_COUNTRY_CODE = '254';

// The separators people actually type. A leading 00 is the international
// dialling prefix and means the same thing as +.
export const cleanPhone = (phone: string): string =>
  (phone || '').replace(/[\s\-().]/g, '').replace(/^00/, '+');

// Digits ready to drop into a wa.me link, or '' when the input is too short to
// be a real number — callers should hide the WhatsApp button in that case
// rather than link somewhere broken.
export const toWhatsAppNumber = (phone: string): string => {
  const cleaned = cleanPhone(phone);
  const digits = cleaned.replace(/\D/g, '');
  if (digits.length < 7) return '';

  // Already carries a country code: +91 98765 43210 → 919876543210.
  if (cleaned.startsWith('+')) return digits;

  // National format with a trunk 0: 0712345678 → 254712345678.
  if (cleaned.startsWith('0')) return DEFAULT_COUNTRY_CODE + digits.replace(/^0+/, '');

  // Bare digits are ambiguous. A subscriber number on its own runs to 9 digits,
  // so anything longer is assumed to already include a country code.
  return digits.length <= 9 ? DEFAULT_COUNTRY_CODE + digits : digits;
};
