import { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | EXPRESSO AI",
  description: "Get in touch with the EXPRESSO AI team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2c1e16] mb-4">Contact Our Team</h1>
          <p className="text-[#6e5646]">
            Get in touch to learn how EXPRESSO AI can transform your organization&apos;s communication.
          </p>
        </div>
        <div className="bg-[#f4ebd8] p-8 rounded-2xl border border-[#d4c3ab]">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
