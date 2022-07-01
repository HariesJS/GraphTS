export const subscribers = []

export const onSubscribe = (fn: () => void) => subscribers.push(fn as never)