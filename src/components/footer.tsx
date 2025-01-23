import React from "react"
import Link from "next/link"
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6"

import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ThemeToggle from "./theme/theme-toggle"

import brand from "@/lib/constants/brand.json"
import { BrandLogo } from "@/components/brand-logo"

// Footer link sections
const footerLinks = {
  Product: [
    { text: "Features", href: "/features" },
    { text: "Pricing", href: "/pricing" },
    { text: "Integrations", href: "/integrations" },
    { text: "Roadmap", href: "/roadmap" },
  ],
  Company: [
    { text: "About Us", href: "/about" },
    { text: "Careers", href: "/careers" },
    { text: "Press", href: "/press" },
    { text: "Blog", href: "/blog" },
  ],
  Resources: [
    { text: "Documentation", href: "/docs" },
    { text: "Support", href: "/support" },
    { text: "Community", href: "/community" },
    { text: "Status", href: "/status" },
  ],
  Legal: [
    { text: "Privacy", href: "/privacy" },
    { text: "Terms", href: "/terms" },
    { text: "Cookies", href: "/cookies" },
    { text: "Security", href: "/security" },
  ],
}

const socialLinks = [
  {
    icon: FaGithub,
    href: `https://github.com/${brand.TWITTER_HANDLE}`,
    label: "GitHub",
  },
  {
    icon: FaLinkedin,
    href: `https://linkedin.com/company/${brand.TWITTER_HANDLE}`,
    label: "LinkedIn",
  },
  {
    icon: FaXTwitter,
    href: `https://x.com/${brand.TWITTER_HANDLE}`,
    label: "X",
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="bg-white/80 dark:bg-brand-900/75 border-t border-gray-200 dark:border-brand-800/50 py-12"
      aria-label="Site Footer"
    >
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand and Description */}
          <div className="col-span-1 space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <BrandLogo />
            </Link>

            <div className="flex flex-col gap-y-8 md:gap-y-2">
              <p className="max-w-xs text-gray-500 dark:text-brand-100">
                {brand.TAGLINE}
              </p>
              {/* <div className="flex-grow" /> */}

              {/* Social Links */}
              <div className="flex gap-4 mt-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 dark:text-brand-600/75 hover:text-gray-900 dark:hover:text-brand-500/90 transition-colors"
                    aria-label={`Follow us on ${social.label}`}
                  >
                    <social.icon className="h-5 w-5 fill-current" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Link Columns */}
          <div className="col-span-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <p className="font-medium text-gray-900 dark:text-white mb-4">
                  {section}
                </p>

                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.text}>
                      <Link
                        href={link.href}
                        className="text-gray-500 hover:text-gray-900 dark:text-brand-600/75 dark:hover:text-brand-500/90 transition-colors"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className="my-8 bg-gray-200 dark:bg-brand-800/50" />

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-brand-100/60">
            &copy; {currentYear} {brand.COMPANY}
          </p>

          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <ThemeToggle />
            <Link
              href="/contact"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
              })}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Subtle decorative element */}
        <div
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand-800 via-brand-300 to-brand-800 opacity-50"
          aria-hidden="true"
        />
      </MaxWidthWrapper>
    </footer>
  )
}
