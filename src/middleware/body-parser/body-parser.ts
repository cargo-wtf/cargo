import { EntityTooLargeException } from "../../http/exceptions/entity-too-large-exception.ts";
import { UnsupportedMediaTypeException } from "../../http/exceptions/unsupported-media-type-exception.ts";
import type { RequestContext } from "../../http/request.ts";
import type { Middleware, Next } from "../middleware.ts";
import { JSONParser } from "./json-parser.ts";

export interface Parser<T> {
  mimeType: string;
  parse: (buffer: Uint8Array) => T;
}

export interface BodyParserOptions {
  maxBodySize: number;
  paser?: Parser<unknown>[];
}

const defaultOptions: BodyParserOptions = {
  maxBodySize: 1024,
  paser: [JSONParser],
};

export function bodyParser(
  parserOptions?: Partial<BodyParserOptions>,
): Middleware {
  const options = { ...defaultOptions, ...parserOptions };
  return async (ctx: RequestContext, next: Next) => {
    const contentType = ctx.request.headers.get("content-type")?.split(" ")[0]
      ?.replace(";", "");
    if (ctx.request.body && contentType) {
      const parser = options.paser?.find((parser) => {
        return parser.mimeType === contentType;
      });
      if (typeof parser?.parse !== "function") {
        throw new UnsupportedMediaTypeException(
          "Content type of request not supported",
        );
      }
      ctx.body = parser.parse(
        await readToMaxSize(ctx.request.body, options.maxBodySize),
      );
    }
    return next();
  };
}

function readToMaxSize(
  stream: ReadableStream<Uint8Array>,
  maxBodySize: number,
): Promise<Uint8Array> {
  return readAll(stream.getReader(), maxBodySize);
}

async function readAll(
  reader: ReadableStreamDefaultReader,
  maxBodySize: number,
): Promise<Uint8Array> {
  let isDone = false;
  let buffer = new Uint8Array(0);
  while (!isDone) {
    const { done, value } = await reader.read();
    if (done) {
      isDone = true;
      break;
    }
    if (isExceeding(buffer, value, maxBodySize)) {
      throw new EntityTooLargeException(
        `Max. body size of ${maxBodySize} bytes exceeded`,
      );
    }
    buffer = new Uint8Array([...buffer, ...value]);
  }
  return buffer;
}

function isExceeding(
  buffer: Uint8Array,
  value: Uint8Array,
  maxBodySize: number,
): boolean {
  return (value.length > maxBodySize ||
    buffer.byteLength > maxBodySize);
}
