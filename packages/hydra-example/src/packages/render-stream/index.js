// @flow

import type { Readable } from 'stream'

const flush = { $flush: '$FLUSH' }
opaque type Flush = typeof flush

opaque type Handler = { $handler: (err: Error) => string }
const handler = ($handler: (err: Error) => string): Handler => ({
  $handler
})

type TemplateValue = Readable | Flush | Handler | Error | string
type Locals<T> = { [prop: $Keys<T>]: Promise<T> }

type Emitable = (cb: (data: string) => void) => Promise<void>

function render(
  templateParts: string[],
  ...values: Array<TemplateValue | Promise<TemplateValue>>
): Emitable {
  let renderError: ?Error = null
  let buffer = ''
  const parts: Array<TemplateValue | Promise<TemplateValue>> = []

  for (let i = 0; i < templateParts.length; ++i) {
    parts.push(templateParts[i])
    parts.push(values[i])
  }

  return async cb => {
    for (let part of parts) {
      try {
        const data: TemplateValue = await part
        if (data === undefined || data === null) continue

        if (data instanceof Error) {
          renderError = data
        } else if (data.$handler) {
          if (renderError) buffer += handler.$handler(renderError)
        } else if (data === flush) {
          cb(buffer)
          buffer = ''
        } else if (typeof data === 'string') {
          buffer += data
        } else if (data.on) {
          if (buffer !== '') {
            cb(buffer)
            buffer = ''
          }

          await new Promise(resolve => {
            data.on('data', cb)
            data.on('end', resolve)
          })
        } else {
          throw new Error(
            'RenderStream can only accept strings, streams, and flush values'
          )
        }
      } catch (e) {
        renderError = e
      }
    }

    if (buffer !== '') cb(buffer)
  }
}

type RenderableProps<T> = {
  render: typeof render,
  locals: Locals<T>,
  flush: Flush,
  handler: typeof handler
}

export default class RenderStream<T> {
  renderer: Emitable

  callbacks: {
    end: Array<() => void>,
    data: Array<(data: string) => void>
  } = {
    end: [],
    data: []
  }

  localsResolvers: { [prop: string]: () => void } = {}

  locals = new Proxy(
    {},
    {
      get: (target, name: string) => {
        if (target[name]) return target[name]

        return new Promise(resolve => {
          this.localsResolvers[name] = () => resolve(target[name])
        })
      }
    }
  )

  constructor(renderFn: (props: RenderableProps<T>) => Emitable) {
    this.renderer = renderFn({ render, handler, flush, locals: this.locals })
  }

  start() {
    this.renderer(data => {
      this.callbacks.data.forEach(cb => cb(data))
    }).then(() => {
      this.callbacks.end.forEach(cb => cb())
    })
  }

  push(obj: $Shape<Locals<T>>) {
    Object.entries(obj).forEach(([name, value]) => {
      this.locals[name] = Promise.resolve(value)

      if (this.localsResolvers[name]) this.localsResolvers[name]()
    })
  }

  on(event: string, cb: (data: string) => void) {
    if (!this.callbacks[event]) this.callbacks[event] = []

    this.callbacks[event].push(cb)
  }
}
