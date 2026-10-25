// Single place for support contact details.
export const WHATSAPP_NUMBER = "18287814165"; // digits only, with country code
export const WHATSAPP_DISPLAY = "+1 828 781 4165";
export const WHATSAPP_MESSAGE = "Hello Smart Assets, I need some help.";
export const whatsappLink = (text = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;