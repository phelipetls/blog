import {
  SandpackProvider,
  SandpackProviderProps,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackThemeProvider,
  useSandpack,
  useSandpackNavigation,
  useSandpackTheme,
} from '@codesandbox/sandpack-react'
import { atomDark } from '@codesandbox/sandpack-themes'
import Tab from './Tab'
import Tabs from './Tabs'
import IconButton from './IconButton'
import { Codesandbox, RefreshCw } from 'lucide-react'
import clsx from 'clsx'
import CopyCodeBlockButton from './CopyCodeBlockButton'

type SandpackProps = SandpackProviderProps & {
  title: string
}

export default function Sandpack(props: SandpackProps) {
  const { title, ...rest } = props

  return (
    <SandpackProvider {...rest}>
      <SandpackThemeProvider
        theme={{
          ...atomDark,
          font: {
            body: '"Fira Sans", sans-serif',
            mono: 'Consolas, Menlo, Monaco, "Fira Code", monospace',
            size: '1rem',
            lineHeight: '1.5',
          },
        }}
      >
        <CustomSandpack title={title} />
      </SandpackThemeProvider>
    </SandpackProvider>
  )
}

type CustomSandpackProps = {
  title: string
}

function CustomSandpack(props: CustomSandpackProps) {
  const { sandpack } = useSandpack()
  const { files, activeFile, visibleFiles, setActiveFile, clients } = sandpack

  const { title } = props

  const { theme } = useSandpackTheme()
  const { refresh } = useSandpackNavigation()

  const createAndNavigateToCodesandbox = async () => {
    const client = Object.values(clients)[0]

    const codesandboxUrl = await client
      // @ts-expect-error TODO: types from the codesandbox library might be broken
      .getCodeSandboxURL()
    if (codesandboxUrl?.editorUrl) {
      window.open(codesandboxUrl?.editorUrl, '_blank')
    }
  }

  return (
    <div className="my-8">
      <Tabs
        value={activeFile}
        onChange={(newActiveFile) => {
          setActiveFile(newActiveFile)
        }}
        style={
          {
            '--sandpack-surface1': theme.colors.surface1,
            '--sandpack-surface3': theme.colors.surface3,
            '--sandpack-accent': theme.colors.accent,
            '--sandpack-base': theme.colors.base,
          } as React.CSSProperties
        }
      >
        {visibleFiles.map((file) => {
          const filename = file.replace(/^\//, '')

          return (
            <Tab
              className={clsx(
                '[&[aria-selected=true]]:bg-[var(--sandpack-surface1)]',
                '[&[aria-selected=true]]:text-[var(--sandpack-accent)]',
                '[&[aria-selected=true]]:shadow-sm',
                '[&[aria-selected=true]]:shadow-shadow',
                'hover:bg-[var(--sandpack-surface3)]',
                'hover:text-[var(--sandpack-base)]',
                'border-b-0',
                'font-normal'
              )}
              key={file}
              value={file}
              label={filename}
            />
          )
        })}
      </Tabs>

      <div className="full-width-on-mobile shadow-sm shadow-shadow sm:rounded-b">
        <div className="dark group relative [&_.sp-code-editor_*]:sm:rounded [&_.sp-code-editor_*]:sm:rounded-tl-none">
          <SandpackCodeEditor showTabs={false} />

          <CopyCodeBlockButton
            // FIXME: internationalize this
            successTooltipText={'Copied'}
            errorTooltipText={'Error'}
            code={files[activeFile].code}
            className={clsx(
              'absolute',
              'right-0',
              'top-3',
              '-translate-x-1/2',
              'transition-opacity',
              'duration-500',
              'opacity-0',
              'pointer-events-none',
              'group-hover:opacity-100',
              'group-hover:pointer-events-auto',
              'focus:opacity-100',
              'focus:pointer-events-auto'
            )}
          />
        </div>

        <hr />

        <div
          className={clsx(
            'relative',
            '[&_.sp-preview-container]:sm:rounded-b',
            '[&_.sp-preview-container]:px-horizontal-padding',
            '[&_.sp-preview-container]:pt-3',
            '[&_.sp-stack]:bg-transparent'
          )}
        >
          <noscript>
            <div className="px-horizontal-padding pt-3 text-on-background">
              You need to enable JavaScript to preview the code.
            </div>
          </noscript>

          <SandpackPreview
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
            title={title}
          />

          <div className="absolute right-horizontal-padding top-3 flex space-x-2">
            <IconButton
              variant="rounded"
              onClick={createAndNavigateToCodesandbox}
              aria-label="Open on Codesandbox"
            >
              <Codesandbox />
            </IconButton>

            <IconButton
              variant="rounded"
              onClick={refresh}
              aria-label="Refresh"
            >
              <RefreshCw />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}
