export function openGame(slug: string) {
  const url = `/games/${slug}/play`;
  const w = Math.min(1200, window.screen.availWidth - 40);
  const h = Math.min(860, window.screen.availHeight - 40);
  const left = Math.round((window.screen.availWidth - w) / 2);
  const top = Math.round((window.screen.availHeight - h) / 2);

  const win = window.open(
    url,
    `game-${slug}`,
    `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`,
  );

  if (!win || win.closed) {
    const fallback = window.open(url, "_blank");
    if (!fallback || fallback.closed) {
      window.location.href = url;
    }
  }
}
