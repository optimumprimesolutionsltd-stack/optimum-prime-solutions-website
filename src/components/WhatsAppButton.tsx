import WhatsAppIcon from './WhatsAppIcon';
import { useSite } from '../context/SiteContext';
interface WhatsAppButtonProps {
  message?: string;
}

export default function WhatsAppButton({ message }: WhatsAppButtonProps) {
  const { data } = useSite();
  const defaultMessage = "Hello Optimum Prime Solutions";
  const encodedMessage = encodeURIComponent(message || defaultMessage);

  return (
    <a
      href={`https://wa.me/${data.contact.whatsapp}?text=${encodedMessage}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 right-20 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/30 flex items-center justify-center transition-all hover:bg-[#1DA851] hover:scale-110"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <WhatsAppIcon className="h-6 w-6 text-white" />
    </a>
  );
}
