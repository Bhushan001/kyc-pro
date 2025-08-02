package com.ekyc.common.exception;

import com.ekyc.common.constants.MessageCodes;

/**
 * Exception thrown when credentials are invalid
 */
public class InvalidCredentialsException extends SaaSPlatformException {
    
    public InvalidCredentialsException() {
        super(MessageCodes.ERROR_INVALID_CREDENTIALS);
    }
    
    public InvalidCredentialsException(String message) {
        super(MessageCodes.ERROR_INVALID_CREDENTIALS, message);
    }
    
    public InvalidCredentialsException(String message, Throwable cause) {
        super(MessageCodes.ERROR_INVALID_CREDENTIALS, message, cause);
    }
} 