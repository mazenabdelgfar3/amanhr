export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-4 px-6 text-center text-xs text-zinc-500 rtl">
      <p>© {new Date().getFullYear()} نظام أمان لإدارة القوى العاملة. جميع الحقوق محفوظة.</p>
    </footer>
  );
}
