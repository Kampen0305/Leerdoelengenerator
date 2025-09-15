import { Settings } from "lucide-react";
import type { FC } from "react";

const PromoFooter: FC = () => {
  return (
    <footer
      data-testid="promo-footer"
      className="mt-8 w-full h-12 md:h-14 flex items-center justify-center px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:shadow-md transition-shadow"
    >
      <Settings className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" aria-hidden="true" />
      <span>Gemaakt door het AI Leerdoelenmaker team. Deel je feedback gerust!</span>
    </footer>
  );
};

export default PromoFooter;
