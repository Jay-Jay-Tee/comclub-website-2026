type SharingBrowser = Pick<Navigator, 'share' | 'canShare' | 'clipboard'>;

export type ShareResult = 'shared' | 'cancelled' | 'unavailable' | 'failed';

// Keep browser calls here so unsupported APIs and rejected permissions are handled alike.
export async function shareEvent(title: string, url: string, browser: SharingBrowser): Promise<ShareResult> {
  if (typeof browser.share !== 'function') return 'unavailable';

  try {
    const data = { title, url };
    if (typeof browser.canShare === 'function' && !browser.canShare(data)) return 'unavailable';

    await browser.share(data);
    return 'shared';
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
      return 'cancelled';
    }
    return 'failed';
  }
}

export async function copyEventLink(url: string, browser: SharingBrowser): Promise<boolean> {
  try {
    if (typeof browser.clipboard?.writeText !== 'function') return false;
    await browser.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
