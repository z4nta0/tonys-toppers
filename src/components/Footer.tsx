export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>
        © {year} Tony's Toppers · Handcrafted in Bolivar, MO ·{' '}
        <a href="tel:4177330681">(417) 733-0681</a>
      </p>
    </footer>
  );
}
