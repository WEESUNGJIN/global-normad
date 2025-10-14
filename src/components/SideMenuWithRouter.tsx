"use client";
import { usePathname } from "next/navigation";
import SideMenu, { type SideMenuProps } from "./SideMenu";

export default function SideMenuWithRouter(
  props: Omit<SideMenuProps, "currentPath">
) {
  const pathname = usePathname() ?? "";
  return <SideMenu {...props} currentPath={pathname} />;
}
