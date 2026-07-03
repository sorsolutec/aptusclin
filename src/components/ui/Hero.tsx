// src/components/ui/Hero.tsx
import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage: string; // path relative to public/
}

export default function Hero({ title, subtitle, ctaText, ctaHref, backgroundImage }: HeroProps) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      <Image
        src={backgroundImage}
        alt="Hero background"
        fill
        className="object-cover brightness-75"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-white mb-6 drop-shadow-md">
            {subtitle}
          </p>
        )}
        {ctaText && ctaHref && (
          <Link
            href={ctaHref}
            className="bg-[#00A3E0] hover:bg-[#0088c0] text-white font-semibold px-8 py-3 rounded-md transition"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}
