import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar"



import { NavigationBar, NavigationMenuItem } from "../../domain/navigation/model";
import { Link } from "@tanstack/react-router";

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navigation: NavigationBar;
}

function renderMenuItems(items: NavigationMenuItem[]) {
  return items.map((item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <Link to={item.url}>{item.title}</Link>
      </SidebarMenuButton>
      {item.subItems && (
        <SidebarMenu>{renderMenuItems(item.subItems)}</SidebarMenu>
      )}
    </SidebarMenuItem>
  ));
}

export function AppSidebar({ navigation, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{navigation.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(navigation.menu)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
