package com.ekyc.common.exception;

import com.ekyc.common.constants.MessageCodes;

/**
 * Exception thrown when validation fails
 */
public class ValidationException extends SaaSPlatformException {
    
    public ValidationException() {
        super(MessageCodes.ERROR_VALIDATION_FAILED);
    }
    
    public ValidationException(String errorCode) {
        super(errorCode);
    }
    
    public ValidationException(String errorCode, String message) {
        super(errorCode, message);
    }
    
    public ValidationException(String errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
    }
} 