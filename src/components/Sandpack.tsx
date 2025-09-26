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
                  'aria-selected:bg-(--sandpack-surface1)',
                  'aria-selected:text-(--sandpack-accent)',
                  'aria-selected:shadow-xs',
                  'aria-selected:shadow-shadow',
                  'hover:bg-(--sandpack-surface3)',
                  'hover:text-(--sandpack-base)',
                  'border-b-0',
                  'font-normal',
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
          'max-sm:full-bleed shadow-shadow shadow-xs',
          'lg:grid lg:grid-cols-2 lg:[grid-template-areas:var(--column-template-areas)]',
          'sm:rounded-sm sm:rounded-tl-none',
          'sm:**:data-preview:rounded-r sm:[&_.sp-preview]:rounded-[inherit] sm:[&_.sp-preview-container]:rounded-[inherit]',
          'sm:**:data-editor:rounded-bl sm:[&_.sp-code-editor]:rounded-bl-[inherit] sm:[&_.sp-editor]:rounded-bl-[inherit]',
          shouldShowConsole &&
            'sm:**:data-editor:rounded-bl-none sm:**:data-preview:rounded-br-none',
          previewOnly && 'sm:rounded-tl sm:**:data-preview:rounded-sm',
        )}
      >
        {shouldShowCodeEditor && (
          <div data-editor className='dark relative lg:[grid-area:editor]'>
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
                '*:transition-opacity',
                '*:duration-300',
                '*:opacity-0',
                '*:pointer-events-none',
                'peer-hover:*:opacity-100',
                'peer-hover:*:pointer-events-auto',
                'hover:*:opacity-100',
                'hover:*:pointer-events-auto',
                'focus-visible:*:opacity-100',
                'focus-visible:*:pointer-events-auto',
              )}
            >
              <CopyCodeBlockButton
                // TODO: internationalize this
                successText={'Copied!'}
                errorText={'Failed to copy'}
                code={files[activeFile].code}
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
          className={clsx('relative', 'lg:[grid-area:preview]')}
        >
          <noscript>
            <div className='px-horizontal-padding text-on-background pt-3'>
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
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
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
            <div className='absolute right-3 bottom-3 flex items-stretch gap-2'>
              <Button
                as={UnstyledOpenInCodeSandboxButton}
                color='secondary'
                aria-label='Open Sandbox'
                className='shadow-shadow rounded-full shadow-xs'
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
                className='shadow-shadow shadow-xs'
              >
                <RefreshCw />
              </IconButton>
            </div>
          )}
        </div>

        {shouldShowConsole && (
          <details
            className='border-divider relative border-t lg:[grid-area:console]'
            onToggle={(e) => {
              e.preventDefault()
              setLogsVisible(!logsVisible)
            }}
          >
            <summary
              className={clsx(
                `px-horizontal-padding flex w-full list-none flex-row justify-start gap-2 bg-(--sandpack-surface1) py-2 text-(--sandpack-accent) lg:rounded-b [&::marker]:hidden [&::webkit-details-marker]:hidden`,
                logsVisible && 'lg:rounded-b-none',
              )}
            >
              <ChevronRight
                className={clsx(
                  'ease transition-transform duration-300',
                  logsVisible && 'rotate-90',
                )}
              />{' '}
              Show console ({logsCount})
            </summary>

            <div
              className={clsx(
                `max-h-40 overflow-y-auto rounded-b bg-(--sandpack-surface1) py-2 text-(--sandpack-base)`,
              )}
            >
              {emptyLogs ? (
                <div className='px-horizontal-padding'>No logs yet</div>
              ) : (
                <SandpackConsole logs={logs} />
              )}
            </div>

            {!emptyLogs && (
              <div className='right-horizontal-padding absolute top-2 flex flex-row gap-2'>
                <Button
                  color='secondary'
                  onClick={resetLogs}
                  aria-label='Reset'
                  className='shadow-shadow shadow-xs'
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
