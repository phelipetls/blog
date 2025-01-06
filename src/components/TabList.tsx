import React from 'react'

interface Props {
  children: React.ReactNode[]
}

const TabList = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { children, ...rest } = props

  return (
    <div ref={ref} role='tablist' className='space-x-1' {...rest}>
      {children}
    </div>
  )
})

TabList.displayName = 'TabList'

export default TabList
