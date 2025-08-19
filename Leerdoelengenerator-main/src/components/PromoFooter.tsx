import { ArrowUpRight, Settings } from "lucide-react";
import type { FC } from "react";

const PromoFooter: FC = () => {
  return (
    <footer
      data-testid="promo-footer"
      className="mt-8 w-full h-12 md:h-14 flex items-center justify-center px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:shadow-md transition-shadow"
    >
      <Settings className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" aria-hidden="true" />
      <span className="mr-1">Gemaakt door DigitEd — bekijk</span>
      <a
        href="https://www.digited.nl?utm_source=leerdoelen.digited.nl&utm_medium=footer&utm_campaign=site_promo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bezoek digited.nl (opent in nieuw tabblad)"
        className="inline-flex items-center text-green-700 dark:text-green-400 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
      >
        digited.nl
        <ArrowUpRight className="w-4 h-4 ml-1" aria-hidden="true" />
      </a>
    </footer>
  );
};

export default PromoFooter;
