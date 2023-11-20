import { useSandpackConsole } from '@codesandbox/sandpack-react'
import clsx from 'clsx'

type SandpackConsoleProps = {
  logs: ReturnType<typeof useSandpackConsole>['logs']
}

export function SandpackConsole(props: SandpackConsoleProps) {
  return (
    <>
      {props.logs
        .filter((log) => log.data?.some((line) => line !== ''))
        .reduce((logs, log) => {
          const lastLog = logs.at(-1)

          if (!lastLog) {
            logs.push({ ...log, count: 1 })
            return logs
          }

          function areLogEntriesEqual(
            logEntryA: typeof log,
            logEntryB: typeof log
          ) {
            return (
              logEntryA.method === logEntryB.method &&
              logEntryA.data?.length === logEntryB.data?.length &&
              logEntryA.data?.every(
                (data, index) =>
                  JSON.stringify(data) ===
                  JSON.stringify(logEntryB.data?.[index])
              )
            )
          }

          if (areLogEntriesEqual(log, lastLog)) {
            logs[logs.length - 1] = {
              ...log,
              count: lastLog.count + 1,
            }
            return logs
          }

          logs.push({
            ...log,
            count: 1,
          })
          return logs
        }, [] as ((typeof props.logs)[0] & { count: number })[])
        .map((log) => {
          return (
            <div
              key={log.id}
              className={clsx(
                'whitespace-nowrap border-l-2 px-horizontal-padding py-2 [overflow-anchor:none]',
                log.method === 'error' ? 'border-warn' : 'border-note'
              )}
            >
              {log.data
                ?.map((d) => {
                  if (typeof d === 'object' && '@t' in d) {
                    return d['@t'].replace(/^\[\[/, '').replace(/\]\]$/, '')
                  }

                  return JSON.stringify(d, null, 2)
                })
                .join(' ')}
              {log.count > 1 && (
                <span className='ml-2 aspect-square w-2 rounded-full bg-surface px-2 py-1 text-on-background'>
                  {log.count}
                </span>
              )}
            </div>
          )
        })}

      <div className='h-[1px] [overflow-anchor:auto]' />
    </>
  )
}
