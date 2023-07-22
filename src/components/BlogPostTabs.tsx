import React from 'react'
import Tabs from './Tabs'
import Tab from './Tab'
import clsx from 'clsx'

type Props = {
  id: string
  tabs: string
  children?: React.ReactElement
}

export default function BlogPostTabs(props: Props) {
  const { id: tabsId, ...slots } = props

  const tabs = Object.fromEntries(
    Object.entries(slots)
      .filter(([slotName]) => {
        return slotName.startsWith('tab:')
      })
      .map(([tabId, content]) => {
        return [tabId.replace(/^tab:/, ''), content]
      })
  )

  const panels = Object.fromEntries(
    Object.entries(slots)
      .filter(([slotName]) => {
        return slotName.startsWith('panel:')
      })
      .map(([tabId, panel]) => {
        return [tabId.replace(/^panel:/, ''), panel]
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
        onChange={(newTabId) => setSelectedTabId(newTabId)}
        aria-label={'Tabs'}
      >
        {Object.entries(tabs)?.map(([tabId, tabLabel]) => {
          const tabUniqueId = `${tabsId}-${tabId}`

          return (
            <Tab
              key={tabId}
              value={tabId}
              label={tabLabel as string}
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
