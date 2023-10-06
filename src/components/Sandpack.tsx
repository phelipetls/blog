import * as React from 'react'
import {
  SandpackProvider,
  SandpackProviderProps,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackThemeProvider,
  useSandpack,
  useSandpackNavigation,
  useSandpackTheme,
  SandpackPreviewRef,
  useSandpackConsole,
  UnstyledOpenInCodeSandboxButton,
} from '@codesandbox/sandpack-react'
import { atomDark } from '@codesandbox/sandpack-themes'
import Tab from './Tab'
import Tabs from './Tabs'
import { ChevronRight, Codesandbox, Play, RefreshCw, Trash } from 'lucide-react'
import clsx from 'clsx'
import CopyCodeBlockButton from './CopyCodeBlockButton'
import Button from './Button'
import IconButton from './IconButton'

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

  const logsContainerRef = React.useRef<HTMLDivElement>(null)

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
        className={clsx(
          'max-sm:full-bleed relative shadow-sm shadow-shadow sm:rounded-b'
        )}
      >
        {shouldShowCodeEditor && (
          <div className='dark relative [&_.sp-code-editor_*]:sm:rounded [&_.sp-code-editor_*]:sm:rounded-tl-none'>
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

        {shouldShowCodeEditor && <hr />}

        <div
          className={clsx(
            'relative',
            !shouldShowConsole && '[&_.sp-preview-container]:sm:rounded-b',
            !shouldShowCodeEditor && '[&_.sp-preview-container]:sm:rounded',
            '[&_.sp-preview-container]:px-horizontal-padding',
            '[&_.sp-preview-container]:pt-3',
            '[&_.sp-stack]:bg-transparent'
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
          />

          {!shouldAutorun && status !== 'running' && (
            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              <Button color='primary' size='huge' onClick={runSandpack}>
                Run Sandbox <Play />
              </Button>
            </div>
          )}

          {status === 'running' && (
            <div className='absolute bottom-3 right-horizontal-padding flex items-stretch gap-2'>
              <Button
                as={UnstyledOpenInCodeSandboxButton}
                color='secondary'
                aria-label='Open Sandbox'
                className='shadow-sm shadow-shadow'
              >
                {/* TODO: Internationalize this */}
                <Codesandbox /> Open Sandbox
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
          <>
            <hr />

            <details
              className='relative'
              onToggle={(e) => {
                e.preventDefault()
                setLogsVisible(!logsVisible)
              }}
            >
              <summary
                className={clsx(
                  `flex w-full list-none flex-row justify-start gap-2 rounded-b rounded-t-none bg-[var(--sandpack-surface1)] px-horizontal-padding py-2 text-[var(--sandpack-accent)] shadow-sm shadow-shadow [&::marker]:hidden [&::webkit-details-marker]:hidden`,
                  logsVisible && 'rounded-b-none'
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
                ref={logsContainerRef}
                className={clsx(
                  `max-h-40 overflow-y-auto rounded-b bg-[var(--sandpack-surface1)] py-2 text-[var(--sandpack-base)]`
                )}
              >
                {emptyLogs ? (
                  <div className='px-horizontal-padding'>No logs yet</div>
                ) : (
                  <>
                    {logs
                      .filter((log) => log.data?.some((line) => line !== ''))
                      .reduce((logs, log) => {
                        const lastLog = logs.at(-1)

                        if (!lastLog) {
                          logs.push({ ...log, count: 1 })
                          return logs
                        }

                        if (
                          log.method === lastLog.method &&
                          log.data?.length === lastLog.data?.length &&
                          log.data?.every(
                            (entry, index) => entry === lastLog.data?.[index]
                          )
                        ) {
                          logs[logs.length - 1] = {
                            ...log,
                            count: lastLog.count + 1,
                          }
                        }

                        return logs
                      }, [] as ((typeof logs)[0] & { count: number })[])
                      .map((log) => {
                        return (
                          <div
                            key={log.id}
                            className={clsx(
                              'whitespace-nowrap border-l-2 px-horizontal-padding py-2 [overflow-anchor:none]',
                              log.method === 'error'
                                ? 'border-warn'
                                : 'border-note'
                            )}
                          >
                            {log.method === 'error' ? 'ERROR: ' : 'INFO: '}{' '}
                            {log.data
                              ?.map((d) =>
                                typeof d === 'object'
                                  ? JSON.stringify(d, null, 2)
                                  : d
                              )
                              .join('')}
                            {log.count > 0 ? (
                              <span className='ml-2 aspect-square w-2 rounded-full bg-surface p-1 text-on-background'>
                                {log.count}
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                        )
                      })}

                    <div className='h-[1px] [overflow-anchor:auto]' />
                  </>
                )}
              </div>

              {!emptyLogs && (
                <div className='absolute right-horizontal-padding top-2 flex flex-row gap-2'>
                  <Button
                    color='secondary'
                    onClick={resetLogs}
                    aria-label='Reset'
                    className='shadow-sm shadow-shadow'
                  >
                    <Trash /> Clear logs
                  </Button>
                </div>
              )}
            </details>
          </>
        )}
      </div>
    </div>
  )
}
