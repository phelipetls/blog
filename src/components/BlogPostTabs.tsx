import React, { useId } from 'react'
import Tabs from './Tabs'
import Tab from './Tab'
import clsx from 'clsx'

type Slots = Record<string, string | React.ReactElement>

export default function BlogPostTabs(slots: Slots) {
  const tabsId = useId()

  const tabs = Object.fromEntries(
    Object.entries(slots)
      .filter(([slotName]) => {
        return slotName.startsWith('tab:')
      })
      .map(([slotName, reactElement]) => {
        return [slotName.replace(/^tab:/, ''), reactElement]
      })
  )

  const panels = Object.fromEntries(
    Object.entries(slots)
      .filter(([slotName]) => {
        return slotName.startsWith('panel:')
      })
      .map(([slotName, reactElement]) => {
        return [slotName.replace(/^panel:/, ''), reactElement]
      })
  )

  const tabsIds = Object.entries(tabs).map(([tabId]) => {
    return tabId
  })

  const firstTabId = tabsIds[0]

  const [selectedTabId, setSelectedTabId] = React.useState<string>(() => {
    return firstTabId
  })

  return (
    <>
      <Tabs
        value={selectedTabId}
        onChange={(newTabId) => {
          setSelectedTabId(newTabId)
        }}
        aria-label={'Tabs'}
      >
        {Object.entries(tabs).map(([tabId, tabLabel]) => {
          const tabUniqueId = `${tabsId}-${tabId}`

          return (
            <Tab
              key={tabId}
              value={tabId}
              label={typeof tabLabel === 'string' ? tabLabel : '[None]'}
              id={`tab-${tabUniqueId}`}
              aria-controls={`tabpanel-${tabUniqueId}`}
            />
          )
        })}
      </Tabs>

      {Object.entries(panels).map(([tabId, panel]) => {
        const tabUniqueId = `${tabsId}-${tabId}`
        const selected = tabId === selectedTabId

        return (
          <div
            key={tabId}
            className={clsx(selected ? 'block' : 'hidden')}
            role='tabpanel'
            id={`tabpanel-${tabUniqueId}`}
            aria-labelledby={`tab-${tabUniqueId}`}
          >
            {panel}
          </div>
        )
      })}
    </>
  )
}
