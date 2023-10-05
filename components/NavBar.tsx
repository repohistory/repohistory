import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex h-16 items-center border-b border-b-[#ffffff20] bg-[#000000a0]">
      <Link className="ml-10 text-lg font-bold text-white" href="/">
        repohistory
      </Link>
    </nav>
  );
}
