import React, { FC } from "react";
import Link from "next/link";
import { headerData } from "../Header/Navigation/menuData";
import { Icon } from "@iconify/react";
import Logo from "../Header/Logo";

// ...existing code...
const Footer: FC = () => {
  return (
    <footer className="pt-16 bg-white dark:bg-black/5">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="lg:w-1/2">
            <Logo />
            <p className="text-xs font-medium text-gray-500  mt-5 mb-6 max-w-[70%]">
              Discover delicious recipes, hidden gems and food spots curated
              just for you.
            </p>
            <div className="flex gap-4 items-center">
              <Link
                href="#"
                aria-label="Facebook"
                className="group bg-white dark:bg-black/90 hover:bg-primary rounded-full shadow-xl p-3"
              >
                <Icon
                  icon="fa6-brands:facebook-f"
                  width="16"
                  height="16"
                  className="group-hover:text-white text-black dark:text-white/90"
                />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="group bg-white dark:bg-black/90 hover:bg-primary rounded-full shadow-xl p-3"
              >
                <Icon
                  icon="fa6-brands:instagram"
                  width="16"
                  height="16"
                  className="group-hover:text-white text-black dark:text-white/90"
                />
              </Link>
              <Link
                href="#"
                aria-label="X"
                className="group bg-white dark:bg-black/90 hover:bg-primary rounded-full shadow-xl p-3"
              >
                <Icon
                  icon="fa6-brands:x-twitter"
                  width="16"
                  height="16"
                  className="group-hover:text-white text-black dark:text-white/90"
                />
              </Link>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 lg:w-1/3 lg:text-right">
            <h4 className="text-black dark:text-white mb-6 font-semibold text-xl">
              All
            </h4>
            <ul className="inline-block text-left">
              {headerData.map((item, index) => (
                <li key={index} className="pb-3">
                  <Link
                    href={item.href}
                    className="text-black/70 dark:text-white/70 dark:hover:text-primary hover:text-primary text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-grey/15 dark:border-white/15 py-10 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link
              href="#"
              className="text-sm text-black/70 dark:text-white/70 px-5 border-r border-grey/15 dark:border-white/15 hover:text-primary dark:hover:text-primary"
            >
              Privacy policy
            </Link>
            <Link
              href="#"
              className="text-sm text-black/70 dark:text-white/70 px-5 hover:text-primary dark:hover:text-primary"
            >
              Terms &amp; conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
