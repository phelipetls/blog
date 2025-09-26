import { useSandpackConsole } from '@codesandbox/sandpack-react'
import clsx from 'clsx'

type Log = ReturnType<typeof useSandpackConsole>['logs'][number]

interface SandpackConsoleProps {
  logs: Log[]
}

type LogWithCounter = Log & {
  count: number
}

export function SandpackConsole(props: SandpackConsoleProps) {
  return (
    <>
      {props.logs
        .filter((log) => log.data?.some((line) => line !== ''))
        .reduce<LogWithCounter[]>((logs, log) => {
          const lastLog = logs.at(-1)

          if (!lastLog) {
            logs.push({ ...log, count: 1 })
            return logs
          }

          function areLogEntriesEqual(
            logEntryA: typeof log,
            logEntryB: typeof log,
          ) {
            return (
              logEntryA.method === logEntryB.method &&
              logEntryA.data?.length === logEntryB.data?.length &&
              logEntryA.data?.every(
                (data, index) =>
                  JSON.stringify(data) ===
                  JSON.stringify(logEntryB.data?.[index]),
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
        }, [])
        .map((log) => {
          return (
            <div
              key={log.id}
              className={clsx(
                'px-horizontal-padding border-l-2 py-2 whitespace-nowrap [overflow-anchor:none]',
                log.method === 'error' ? 'border-warn' : 'border-note',
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
                <span className='bg-surface text-on-background ml-2 aspect-square w-2 rounded-full px-2 py-1'>
                  {log.count}
                </span>
              )}
            </div>
          )
        })}

      <div className='h-px [overflow-anchor:auto]' />
    </>
  )
}
