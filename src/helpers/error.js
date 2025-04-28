function createError(errorCode, errorMessage, messageVars, numericErrorCode, error, statusCode, c) {
    c.header('X-Epic-Error-Name', errorCode);
    c.header('X-Epic-Error-Code', numericErrorCode);

    return c.json({
        errorCode,
        errorMessage,
        messageVars: messageVars || {},
        numericErrorCode,
        originatingService: "any",
        intent: "prod",
        error_description: errorMessage,
        error
    }, statusCode);
}

export default createError;