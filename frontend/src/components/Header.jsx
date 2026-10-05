function Header() {
  return (
    <header className="flex justify-between">
      <h2 className=''> YouTube</h2>
      <div className="flex gap-4">
        <a href="/search">search</a>
        <a href="/trending">Trending</a>
      </div>

      <nav className="flex gap-4 px-16">
        
        <a href="/login">Sign In</a>
      </nav>
    </header>
  );
}

export default Header