import SwasthiLogo from './SwasthiLogo';

const Header = ({ title, subtitle, showLogo = true, children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-dark-surface border-b dark:border-dark-border p-4 ${className}`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showLogo && <SwasthiLogo className="w-8 h-8 flex-shrink-0" />}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text-primary">{title}</h1>
            {subtitle && <p className="text-gray-600 dark:text-dark-text-secondary">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;