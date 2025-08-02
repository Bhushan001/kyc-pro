package com.ekyc.common.exception;

import com.ekyc.common.constants.MessageCodes;

/**
 * Exception thrown when a user is not found
 */
public class UserNotFoundException extends SaaSPlatformException {
    
    public UserNotFoundException() {
        super(MessageCodes.ERROR_USER_NOT_FOUND);
    }
    
    public UserNotFoundException(String message) {
        super(MessageCodes.ERROR_USER_NOT_FOUND, message);
    }
    
    public UserNotFoundException(String message, Throwable cause) {
        super(MessageCodes.ERROR_USER_NOT_FOUND, message, cause);
    }
} 