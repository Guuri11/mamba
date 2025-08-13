import React, { useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { GetNavigation } from "../../application/usecases/get-navigation";
import { JsonNavigationRepository } from "../../infrastructure/repositories/navigation-repository";
import navigationData from "../../infrastructure/repositories/navigation.json";
import { NavigationBar } from "../../domain/navigation/model";
import { getBreadcrumbsForPath } from "../lib/breadcrumbs";
import { useRouter } from "@tanstack/react-router";

interface MambaSidebarProps {
  children: React.ReactNode;
}

export const MambaSidebar: React.FC<MambaSidebarProps> = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationBar | null>(null);
  const router = useRouter();
  const pathname = router.state.location.pathname;

  useEffect(() => {
    const repo = new JsonNavigationRepository(navigationData as NavigationBar);
    const usecase = new GetNavigation(repo);
    usecase.execute().then(setNavigation);
  }, []);

  if (!navigation) return null; // Or a loading spinner

  const breadcrumbItems = getBreadcrumbsForPath(navigation, pathname);

  return (
    <SidebarProvider>
      <AppSidebar navigation={navigation} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, idx) => (
                <React.Fragment key={item.label}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <a href={item.href}>{item.label}</a>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {idx < (breadcrumbItems.length - 1) && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};
