import type { FC, ReactNode } from "react";
import PromoFooter from "./PromoFooter";
import DigitEdPromo from "./DigitEdPromo";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">{children}</div>
      <DigitEdPromo />
      <PromoFooter />
    </div>
  );
};

export default Layout;
