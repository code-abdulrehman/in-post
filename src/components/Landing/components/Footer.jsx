import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaYoutube,
} from 'react-icons/fa';
import PPostLogo from './PPostLogo';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Export', href: '#export' },
      { name: 'Canvas sizes', href: '#canvas-sizes' },
      { name: 'FAQ', href: '#faq' },
      { name: 'Editor', href: '/app' },
    ],
    Company: [
      { name: 'About', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    Resources: [
      { name: 'Help & FAQ', href: '#faq' },
      { name: 'Open app', href: '/app' },
    ],
    Legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FaGithub, href: '#', label: 'GitHub' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="relative border-t border-stone-200 bg-stone-50 text-neutral-900">
      <div
        className="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="font-serif text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              PPost
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-600 sm:text-[15px]">
              Social-ready canvas in the browser—light layout and orange accents to match your
              graphics.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-600 shadow-sm transition hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-md"
                >
                  <social.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-2 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {category}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-stone-700 transition hover:text-orange-600"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-stone-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500 sm:text-sm">
            © {new Date().getFullYear()} PPost. Replace placeholder legal links before launch.
          </p>
          <p className="text-xs font-medium tracking-wide text-stone-400 sm:text-sm">
            Powered by PPost
          </p>
        </div>
      </div>

      <div className="pointer-events-none border-t border-stone-100/80 bg-gradient-to-b from-stone-50 via-white to-white">
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:py-10">
          <PPostLogo
            variant="full"
            className="h-9 w-auto max-w-[min(100vw,2rem)] shrink-0 text-orange-500/25 select-none sm:h-10 md:h-11 md:max-w-[min(100vw,82rem)]"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
