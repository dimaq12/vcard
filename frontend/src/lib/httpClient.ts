const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

type ResponseTypes = 'json' | 'text' | 'blob' | 'arraybuffer';

export type RequestOptions<T = unknown> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: T;
  headers?: Record<string, string>;
  responseType?: ResponseTypes;      
  credentials?: RequestCredentials;  
};

export async function api<ResponseType = unknown, BodyType = unknown>(
  path: string,
  options: RequestOptions<BodyType> = {},
): Promise<ResponseType> {
  const {
    method = 'GET',
    body,
    headers = {},
    responseType = 'json',
    credentials = 'include',
  } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`API Error ${res.status}: ${message}`);
  }

  switch (responseType) {
    case 'text':
      return res.text() as unknown as ResponseType;
    case 'blob':
      return res.blob() as unknown as ResponseType;
    case 'arraybuffer':
      return res.arrayBuffer() as unknown as ResponseType;
    default: 
      return res.json() as ResponseType;
  }
}


type DownloadOptions = {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  fallbackName?: string;
};

export async function download(
  path: string,
  { headers = {}, credentials = 'include', fallbackName = 'download' }: DownloadOptions = {},
): Promise<void> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers,
    credentials,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Download error ${res.status}: ${message}`);
  }

  const blob = await res.blob();

  let filename = fallbackName;
  const cd = res.headers.get('Content-Disposition');
  if (cd) {
    const m = /filename\*?=(?:UTF-8''|")?([^;"\n]+)/i.exec(cd);
    if (m?.[1]) filename = decodeURIComponent(m[1].replace(/^"+|"+$/g, ''));
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
