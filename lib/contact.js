// Single place for support contact details.
export const WHATSAPP_NUMBER = "15402387812"; // digits only, with country code
export const WHATSAPP_DISPLAY = "+1 540 238 7812";
export const WHATSAPP_MESSAGE = "Hello Smart Assets, I need some help.";
export const whatsappLink = (text = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;