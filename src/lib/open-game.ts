export function openGame(slug: string) {
  const w = Math.min(1200, window.screen.availWidth - 40);
  const h = Math.min(860, window.screen.availHeight - 40);
  const left = Math.round((window.screen.availWidth - w) / 2);
  const top = Math.round((window.screen.availHeight - h) / 2);
  window.open(
    `/games/${slug}/play`,
    `game-${slug}`,
    `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
  );
}
