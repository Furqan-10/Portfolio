export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">
      <p>Designed &amp; built by <span className="text-gradient font-semibold">Furqan Asif</span> · {new Date().getFullYear()}</p>
    </footer>
  );
}
