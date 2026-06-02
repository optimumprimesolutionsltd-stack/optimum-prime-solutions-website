import WhatsAppIcon from './WhatsAppIcon';
import { useSite } from '../context/SiteContext';
export default function WhatsAppButton() {
  const { data } = useSite();
  return (
    <a
      href={`https://wa.me/${data.contact.whatsapp}?text=Hello%20Optimum%20Prime%20Solutions`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-20 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/30 flex items-center justify-center transition-all hover:bg-[#1DA851] hover:scale-110"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon className="h-6 w-6 text-white" />
    </a>
  );
}
