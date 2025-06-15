// NavLink.jsx
import Link from "next/link";

const NavLink = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="block py-2 pl-3 pr-4 text-slate-700 sm:text-xl rounded md:p-0 hover:text-slate-900 dark:text-[#ADB7BE] dark:hover:text-white"
    >
      {title}
    </Link>
  );
};

export default NavLink;