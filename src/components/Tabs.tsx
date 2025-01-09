import React from 'react'
import TabList from './TabList'
import type { TabProps } from './Tab'

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value: string
  onChange: (value: string) => void
  children: React.ReactElement<TabProps>[]
}

export default function Tabs(props: Props) {
  const { value, ...rest } = props

  const tabListRef = React.useRef<HTMLDivElement | null>(null)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentTab = event.currentTarget
    let flag = false

    if (!tabListRef.current) {
      return
    }

    const tabElements = Array.from(
      tabListRef.current.children
    ) as HTMLButtonElement[]

    const firstTab = tabElements[0]
    const lastTab = tabElements[tabElements.length - 1]

    let prevTab: HTMLButtonElement

    if (currentTab === firstTab) {
      prevTab = lastTab
    } else {
      const targetTabIndex = tabElements.indexOf(currentTab)
      prevTab = tabElements[targetTabIndex - 1]
    }

    let nextTab: HTMLButtonElement

    if (currentTab === lastTab) {
      nextTab = firstTab
    } else {
      const targetTabIndex = tabElements.indexOf(currentTab)
      nextTab = tabElements[targetTabIndex + 1]
    }

    switch (event.key) {
      case 'ArrowLeft':
        prevTab.focus()
        flag = true
        break

      case 'ArrowRight':
        nextTab.focus()
        flag = true
        break

      case 'Home':
        firstTab.focus()
        flag = true
        break

      case 'End':
        lastTab.focus()
        flag = true
        break

      default:
        break
    }

    if (flag) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  const tabs = React.Children.map(props.children, (child) => {
    if (!React.isValidElement(child)) {
      return null
    }

    const selected = child.props.value === value

    return React.cloneElement(child, {
      selected,
      onClick: () => {
        console.log('clicked')
        props.onChange(child.props.value)
      },
      onKeyDown: handleKeyDown,
    })
  })

  return (
    <TabList ref={tabListRef} {...rest}>
      {tabs}
    </TabList>
  )
}
