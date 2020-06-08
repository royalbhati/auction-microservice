import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import middy from '@middy/core';

export default (handler) =>
  middy(handler).use([
    jsonBodyParser(),
    httpEventNormalizer(),
    httpErrorHandler(),
  ]);
