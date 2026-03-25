export function openGame(slug: string) {
  const url = `/games/${slug}/play`;
  const viewportPadding = window.matchMedia("(pointer: coarse)").matches ? 8 : 16;
  const w = Math.max(320, window.screen.availWidth - viewportPadding);
  const h = Math.max(320, window.screen.availHeight - viewportPadding);
  const left = Math.round((window.screen.availWidth - w) / 2);
  const top = Math.round((window.screen.availHeight - h) / 2);

  const win = window.open(
    url,
    `game-${slug}`,
    `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=no,resizable=yes`,
  );

  if (!win || win.closed) {
    const fallback = window.open(url, "_blank");
    if (!fallback || fallback.closed) {
      window.location.href = url;
    }
  }
}
