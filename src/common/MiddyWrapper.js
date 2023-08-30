const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpHeaderNormalizer = require('@middy/http-header-normalizer');
const httpErrorHandler = require('@middy/http-error-handler');
const errorLogger = require('@middy/error-logger'); 


const middyServices = [
    jsonBodyParser(),
    httpHeaderNormalizer(),
    httpErrorHandler(),
    errorLogger(),
];

const applyMiddlewares  = (handler) => {
    return middy(handler).use(middyServices);
};

const applyMiddlewaresToAllMethods = (controller) => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(controller));
    for (const method of methods) {
        if (typeof controller[method] === 'function' && method !== 'constructor') {
            controller[method] = applyMiddlewares(controller[method]);
        }
    }
};

module.exports = applyMiddlewaresToAllMethods;