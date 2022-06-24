import { HttpHeaders } from '@angular/common/http';
import { BasicHttpRequest } from './basic-http-request.model';

export class BackApiHttpRequest implements BasicHttpRequest {
  public path?: string | undefined;
  public domain: string;
  public queryParams?: { [key: string]: string } | undefined;
  public segment?: string | undefined;
  public body?: string | undefined;
  public headers?: HttpHeaders;

  constructor(
    path: string,
    queryParams?: { [key: string]: string } | undefined,
    body?: string | undefined,
    headers?: HttpHeaders,
    segment?: string | undefined
  ) {
    this.domain = 'http://192.168.100.12:4009';
    this.path = path;
    this.queryParams = queryParams;
    this.body = body;
    this.segment = segment;
    this.headers = headers;
  }
}
