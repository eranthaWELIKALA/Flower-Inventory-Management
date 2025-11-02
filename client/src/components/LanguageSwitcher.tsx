import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="en">English</option>
        <option value="si">සිංහල</option>
      </select>
    </div>
  );
}

