import * as DevIcons from '@components/devicons'

const devIconsNames = Object.keys(DevIcons)

type DevIconName = keyof typeof DevIcons

export function isDevIcon(name: string): name is DevIconName {
  return devIconsNames.includes(name)
}
