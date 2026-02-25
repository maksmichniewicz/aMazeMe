import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-logo">
          <span className="header-icon">🧩</span>
          <h1>aMazeMe</h1>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
