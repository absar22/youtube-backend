function Header() {
  const isLoggedIn = false
  return (
    <header className="flex justify-between bg-zinc-950 text-white px-6 py-4">
      <h2 className='font-bold text-lg text-white bg-zinc-800'> YouTube</h2>
      <div className="flex gap-4">
        <a href="/search" className="hover:bg-zinc-700 font-semibold text-gray-300">Search</a>
        <a href="/trending" className="hover:bg-zinc-700 font-semibold text-gray-300">Trending</a>
      </div>

      <nav className="flex gap-4 px-16">
        {isLoggedIn ? (
          <>
            <a href="/profile" className="hover:bg-zinc-700 font-semibold text-gray-300">Profile</a>
            <a href="/logout" className="hover:bg-zinc-700 font-semibold text-gray-300">Logout</a>
          </>
        ) : (
          <a href="/Login" className="hover:bg-zinc-700 font-semibold text-gray-300">Sign In</a>
        )}
      </nav>
    </header>
  );
}

export default Header