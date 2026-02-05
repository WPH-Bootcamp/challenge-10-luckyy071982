import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-8">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-[12px] text-slate-500 sm:text-[14px]">
        <div className="flex items-center text-center">
          <p>© 2026 Web Programming Hack Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
