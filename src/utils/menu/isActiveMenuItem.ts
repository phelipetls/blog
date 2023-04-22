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
  let isActive = currentPathname.startsWith(menuItemPathname)

  if (menuItemPathname === rootPathname) {
    isActive = currentPathname === menuItemPathname
  }

  if (currentPathname + '/' === rootPathname) {
    isActive = currentPathname + '/' === menuItemPathname
  }

  return isActive
}
