type IsActiveMenuItemOptions = {
  currentPathname: string
  menuItemPathname: string
  rootPathname: string
}

export const isActiveMenuItem = ({
  currentPathname,
  menuItemPathname,
  rootPathname,
}: IsActiveMenuItemOptions) => {
  const itemPathname = menuItemPathname

  let isActive = currentPathname.startsWith(itemPathname)

  if (menuItemPathname === rootPathname) {
    isActive = currentPathname === menuItemPathname
  }

  return isActive
}
