import * as React from 'react'
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackThemeProvider,
  useSandpack,
  useSandpackNavigation,
  useSandpackTheme,
  useSandpackConsole,
  UnstyledOpenInCodeSandboxButton,
} from '@codesandbox/sandpack-react'
import type {
  SandpackProviderProps,
  SandpackPreviewRef,
} from '@codesandbox/sandpack-react'
import { atomDark } from '@codesandbox/sandpack-themes'
import Tab from './Tab'
import Tabs from './Tabs'
import { ChevronRight, Codesandbox, Play, RefreshCw, Trash } from 'lucide-react'
import clsx from 'clsx'
import CopyCodeBlockButton from './CopyCodeBlockButton'
import Button from './Button'
import IconButton from './IconButton'
import { SandpackConsole } from './SandpackConsole'

export type SandpackProps = SandpackProviderProps & {
  title: string
  initialURL?: string
  shouldShowCodeEditor?: boolean
  shouldShowNavigator?: boolean
  shouldShowConsole?: boolean
}

export default function Sandpack(props: SandpackProps) {
  const {
    title,
    initialURL,
    shouldShowCodeEditor = true,
    shouldShowNavigator = false,
    shouldShowConsole = false,
    options,
    ...rest
  } = props

  return (
    <SandpackProvider options={options} {...rest}>
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
        <CustomSandpack
          title={title}
          initialURL={initialURL}
          shouldShowCodeEditor={shouldShowCodeEditor}
          shouldShowNavigator={shouldShowNavigator}
          shouldShowConsole={shouldShowConsole}
          shouldAutorun={options?.autorun ?? true}
        />
      </SandpackThemeProvider>
    </SandpackProvider>
  )
}

type CustomSandpackProps = SandpackProps & {
  shouldAutorun: boolean
}

function CustomSandpack(props: CustomSandpackProps) {
  const {
    title,
    initialURL,
    shouldShowCodeEditor,
    shouldShowNavigator,
    shouldShowConsole,
    shouldAutorun,
  } = props

  const previewOnly = !shouldShowCodeEditor

  const { sandpack } = useSandpack()
  const {
    files,
    activeFile,
    visibleFiles,
    setActiveFile,
    runSandpack,
    status,
  } = sandpack

  const sandpackPreviewRef = React.useRef<SandpackPreviewRef>(null)
  const [clientId, setClientId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const clientId = sandpackPreviewRef.current?.clientId

    setClientId(clientId ?? null)
    /**
     * NOTE: In order to make sure that the client will be available
     * use the whole `sandpack` object as a dependency.
     */
  }, [sandpack])

  const [logsVisible, setLogsVisible] = React.useState(false)
  const { logs, reset: resetLogs } = useSandpackConsole({
    clientId: clientId ?? '',
    resetOnPreviewRestart: true,
    showSyntaxError: true,
  })

  const logsCount = logs.length
  const emptyLogs = logsCount === 0

  const { theme } = useSandpackTheme()
  const { refresh } = useSandpackNavigation()

  return (
    <div
      className='my-8'
      style={
        {
          '--sandpack-surface1': theme.colors.surface1,
          '--sandpack-surface3': theme.colors.surface3,
          '--sandpack-accent': theme.colors.accent,
          '--sandpack-base': theme.colors.base,
        } as React.CSSProperties
      }
    >
      {shouldShowCodeEditor && (
        <Tabs
          value={activeFile}
          onChange={(newActiveFile) => {
            setActiveFile(newActiveFile)
          }}
        >
          {visibleFiles.map((file) => {
            const filename = file.replace(/^\//, '')

            return (
              <Tab
                className={clsx(
                  'bg-surface',
                  'text-on-background',
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
      )}

      <div
        style={{
          // @ts-expect-error This is ok
          '--column-template-areas': shouldShowCodeEditor
            ? `
            "editor preview"
            "editor preview"
            "console console"
          `
            : `
            "preview preview"
            "preview preview"
            "console console"
          `,
        }}
        className={clsx(
          'max-sm:full-bleed shadow-sm shadow-shadow',
          'lg:grid lg:grid-cols-2 lg:[grid-template-areas:_var(--column-template-areas)]',
          'lg:rounded lg:rounded-tl-none',
          'lg:[&_.sp-preview-container]:rounded-[inherit] lg:[&_.sp-preview]:rounded-[inherit] lg:[&_[data-preview]]:rounded-r',
          'lg:[&_.sp-code-editor]:rounded-bl-[inherit] lg:[&_.sp-editor]:rounded-bl-[inherit] lg:[&_[data-editor]]:rounded-bl',
          shouldShowConsole &&
            'lg:[&_[data-editor]]:rounded-bl-none lg:[&_[data-preview]]:rounded-br-none',
          previewOnly && 'lg:rounded-tl lg:[&_[data-preview]]:rounded'
        )}
      >
        {shouldShowCodeEditor && (
          <div
            data-editor
            className='dark relative lg:border-b lg:border-divider lg:[grid-area:_editor]'
          >
            <SandpackCodeEditor
              className='peer max-h-[450px]'
              showTabs={false}
              showRunButton={false}
            />

            <div
              className={clsx(
                'absolute',
                'right-3',
                'top-3',
                'space-x-2',
                '[&_[data-show-on-hover]]:transition-opacity',
                '[&_[data-show-on-hover]]:duration-300',
                '[&_[data-show-on-hover]]:opacity-0',
                '[&_[data-show-on-hover]]:pointer-events-none',
                '[&_[data-show-on-hover]]:peer-hover:opacity-100',
                '[&_[data-show-on-hover]]:peer-hover:pointer-events-auto',
                '[&_[data-show-on-hover]]:hover:opacity-100',
                '[&_[data-show-on-hover]]:hover:pointer-events-auto',
                '[&_[data-show-on-hover]]:focus-visible:opacity-100',
                '[&_[data-show-on-hover]]:focus-visible:pointer-events-auto'
              )}
            >
              <CopyCodeBlockButton
                // TODO: internationalize this
                successText={'Copied!'}
                errorText={'Failed to copy'}
                code={files[activeFile].code}
                data-show-on-hover
              />

              {!shouldAutorun && (
                <IconButton variant='rounded' onClick={runSandpack}>
                  <Play />
                </IconButton>
              )}
            </div>
          </div>
        )}

        <div
          data-preview
          className={clsx(
            'relative',
            'lg:[grid-area:_preview]',
            '[&_.sp-preview-container]:px-horizontal-padding',
            '[&_.sp-preview-container]:py-3',
            '[&_.sp-preview-container]:bg-[var(--sandpack-surface1)]',
            'lg:border-b',
            'lg:border-l',
            'lg:border-divider'
          )}
        >
          <noscript>
            <div className='px-horizontal-padding pt-3 text-on-background'>
              You need to enable JavaScript to preview the code.
            </div>
          </noscript>

          <SandpackPreview
            ref={sandpackPreviewRef}
            startRoute={initialURL}
            showNavigator={shouldShowNavigator}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
            title={title}
            className='h-full'
          />

          {!shouldAutorun && status !== 'running' && (
            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              <Button
                color='primary'
                size='huge'
                onClick={runSandpack}
                endIcon={<Play />}
                className='rounded-full'
              >
                Run Sandbox
              </Button>
            </div>
          )}

          {status === 'running' && (
            <div className='absolute bottom-6 right-6 flex items-stretch gap-2'>
              <Button
                as={UnstyledOpenInCodeSandboxButton}
                color='secondary'
                aria-label='Open Sandbox'
                className='rounded-full shadow-sm shadow-shadow'
                startIcon={<Codesandbox />}
              >
                {/* TODO: Internationalize this */}
                Open Sandbox
              </Button>

              <IconButton
                variant='rounded-full'
                onClick={() => {
                  refresh()
                  resetLogs()
                }}
                aria-label='Refresh'
                className='shadow-sm shadow-shadow'
              >
                <RefreshCw />
              </IconButton>
            </div>
          )}
        </div>

        {shouldShowConsole && (
          <details
            className='relative lg:[grid-area:_console]'
            onToggle={(e) => {
              e.preventDefault()
              setLogsVisible(!logsVisible)
            }}
          >
            <summary
              className={clsx(
                `flex w-full list-none flex-row justify-start gap-2 bg-[var(--sandpack-surface1)] px-horizontal-padding py-2 text-[var(--sandpack-accent)] lg:rounded-b [&::marker]:hidden [&::webkit-details-marker]:hidden`,
                logsVisible && 'lg:rounded-b-none'
              )}
            >
              <ChevronRight
                className={clsx(
                  'ease transition-transform duration-300',
                  logsVisible && 'rotate-[90deg]'
                )}
              />{' '}
              Show console ({logsCount})
            </summary>

            <div
              className={clsx(
                `max-h-40 overflow-y-auto rounded-b bg-[var(--sandpack-surface1)] py-2 text-[var(--sandpack-base)]`
              )}
            >
              {emptyLogs ? (
                <div className='px-horizontal-padding'>No logs yet</div>
              ) : (
                <SandpackConsole logs={logs} />
              )}
            </div>

            {!emptyLogs && (
              <div className='absolute right-horizontal-padding top-2 flex flex-row gap-2'>
                <Button
                  color='secondary'
                  onClick={resetLogs}
                  aria-label='Reset'
                  className='shadow-sm shadow-shadow'
                  startIcon={<Trash />}
                >
                  Clear logs
                </Button>
              </div>
            )}
          </details>
        )}
      </div>
    </div>
  )
}
