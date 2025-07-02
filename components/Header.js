"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "./ButtonSignin";
import ButtonAccount from "./ButtonAccount";
import logo from "@/app/icon.png";
import config from "@/config";
import { useSession } from "next-auth/react";

const links = [
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/#testimonials",
    label: "Reviews",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

// A header with a logo on the left, links in the center (like Pricing, etc...), and a CTA (like Get Started or Login) on the right.
// The header is responsive, and on mobile, the links are hidden behind a burger button.
const Header = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  // setIsOpen(false) when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  const isDashboard = pathname?.startsWith('/dashboard');
  const isLandingPage = pathname === '/';

  return (
    <header className="bg-base-200">
      <nav
        className="container flex items-center justify-between px-8 py-4 mx-auto"
        aria-label="Global"
      >
        {/* Back arrow and logo */}
        <div className="flex items-center gap-4">
          {isDashboard && (
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </Link>
          )}
          <Link
            className="flex items-center gap-2 shrink-0"
            href={isDashboard ? "/dashboard" : "/"}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              placeholder="blur"
              priority={true}
              width={300}
              height={300}
              className="w-[200px] md:w-[300px]"
            />
            <span className="font-extrabold text-lg hidden md:block">{config.appName}</span>
          </Link>
        </div>

        {/* Burger button to open menu on mobile */}
        <div className="flex lg:hidden ml-4">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-base-content"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Your links on large screens */}
        {!isDashboard && (
          <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center lg:ml-24">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="link link-hover text-base-content/80 hover:text-base-content"
                title={link.label}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <>
                <Link 
                  href="/dashboard" 
                  className="link link-hover text-base-content/80 hover:text-base-content ml-8"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/expertos" 
                  className="link link-hover text-base-content/80 hover:text-base-content"
                >
                  Expertos
                </Link>
                <Link 
                  href="/adminPanel" 
                  className="link link-hover text-base-content/80 hover:text-base-content"
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        )}

        {/* CTA on large screens */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1 lg:ml-8">
          {session ? <ButtonAccount /> : <ButtonSignin extraStyle="btn-primary" />}
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className={`fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300`}
        >
          {/* Your logo/name on small screens */}
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center gap-2 shrink-0"
              href={isDashboard ? "/dashboard" : "/"}
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                placeholder="blur"
                priority={true}
                width={200}
                height={200}
                className="w-[150px]"
              />
              <span className="font-extrabold text-lg">{config.appName}</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Your links on small screens */}
          {!isDashboard && (
            <div className="flow-root mt-6">
              <div className="py-4">
                <div className="flex flex-col gap-y-4 items-start">
                  {links.map((link) => (
                    <Link
                      href={link.href}
                      key={link.href}
                      className="link link-hover text-base-content/80 hover:text-base-content"
                      title={link.label}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {session && (
                    <>
                      <Link 
                        href="/dashboard" 
                        className="link link-hover text-base-content/80 hover:text-base-content"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/expertos" 
                        className="link link-hover text-base-content/80 hover:text-base-content"
                      >
                        Expertos
                      </Link>
                      <Link 
                        href="/adminPanel" 
                        className="link link-hover text-base-content/80 hover:text-base-content"
                      >
                        Admin
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="divider"></div>
            </div>
          )}
          {/* Your CTA on small screens */}
          <div className="flex flex-col">
            {session ? <ButtonAccount /> : <ButtonSignin extraStyle="btn-primary" />}
          </div>
          {session && (
            <Link 
              href="/adminPanel" 
              className="block mt-4 text-base-content/80 hover:text-base-content"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
