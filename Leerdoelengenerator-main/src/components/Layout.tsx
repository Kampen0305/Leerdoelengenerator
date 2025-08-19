import type { FC, ReactNode } from "react";
import PromoFooter from "./PromoFooter";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">{children}</div>
      <PromoFooter />
    </div>
  );
};

export default Layout;
