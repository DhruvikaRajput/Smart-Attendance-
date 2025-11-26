export default function NavBar() {
  return (
    <nav className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Smart Attendance System</h2>
        <div className="text-sm text-text-secondary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </nav>
  );
}

