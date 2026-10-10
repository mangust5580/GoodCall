export const READ_TIMEOUT_MS = 10_000;

export async function withReadDeadline<T>(
  read: (signal: AbortSignal) => Promise<T>,
  timedOut: T,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      controller.abort();
      resolve(timedOut);
    }, READ_TIMEOUT_MS);
  });

  try {
    return await Promise.race([read(controller.signal), deadline]);
  } finally {
    clearTimeout(timer);
  }
}
