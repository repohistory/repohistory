import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex h-16 items-center border-b border-b-[#30363D] bg-[#010409]">
      <Link className="ml-10 text-lg font-bold text-white" href="/">
        repohistory
      </Link>
    </nav>
  );
}
