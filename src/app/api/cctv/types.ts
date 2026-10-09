export type CctvStreamType = 'jpg' | 'hls' | 'iframe' | 'mjpeg' | 'mp4';

export interface CctvCamera {
  id: string;
  lat: number;
  lng: number;
  name: string;
  city: string;
  country: string;
  /** Static image URL (MJPEG/JPG snapshot) */
  feed_url?: string;
  /** Live video stream (HLS .m3u8) or embed URL (YouTube/rtsp.me) */
  stream_url?: string;
  stream_type?: CctvStreamType;
  external_url?: string;
  source: string;
}

/*
 * Hosts whose still images a browser cannot load straight from the source.
 * infobanjirjps.selangor.gov.my — Selangor's flood cameras — serves over
 * plain http, which an https page blocks as mixed content, so the picture is
 * there in development and gone in production. The proxy re-serves it over
 * https. A host added here must also be in the proxy's own allowlist.
 */
const PROXY_IMAGE_HOSTS = ['infobanjirjps.selangor.gov.my'];

/** The URL a browser can actually load this still from. */
export function proxiedImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  let host: string;
  try {
    host = new URL(trimmed).hostname.toLowerCase();
  } catch {
    return trimmed;
  }
  return PROXY_IMAGE_HOSTS.some(h => host === h || host.endsWith('.' + h))
    ? `/api/cctv/proxy?url=${encodeURIComponent(trimmed)}`
    : trimmed;
}

export function normalizeFeedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  const noQuery = trimmed.split('?')[0];
  if (noQuery.toLowerCase().startsWith('pics/')) {
    return `http://free-webcambg.com/${noQuery}`;
  }
  return noQuery;
}

export function inferStreamType(url: string): CctvStreamType {
  const trimmed = url.trim();
  if (!trimmed) return 'jpg';

  const lower = trimmed.toLowerCase();

  if (/\.m3u8(?:\?|$)/i.test(lower)) return 'hls';

  if (/youtube\.com\/embed|youtube-nocookie\.com\/embed|rtsp\.me\/embed|ipcamlive\.com\/player|click2stream\.com|windy\.com\/webcams\/\d+\/embed|skylinewebcams\.com|voyage\.aprr\.fr/i.test(lower)) {
    return 'iframe';
  }

  if (/\.mp4(?:\?|$)|\.m4v(?:\?|$)|\.webm(?:\?|$)|\.mov(?:\?|$)|[?&](?:format|file|type)=mp4(?:&|$)/i.test(lower)) {
    return 'mp4';
  }

  if (/\.(?:mjpg|mjpeg)(?:\?|$)|\/(?:mjpg|mjpeg)(?:\?|$)|\/cgi-bin\/[^?]*mjpg/i.test(lower)) {
    return 'mjpeg';
  }

  return 'jpg';
}
