
function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white py-4">
      <p className="font-bold text-center">© {currentYear} Absar Ahmad</p>
      <div className="flex gap-4 justify-center">
        <a href="#">GitHub</a>
        <a href="#">LinkedIn</a>
        <a href="#">Twitter</a>
      </div>
    </footer>
  );
}

export default Footer;