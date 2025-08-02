package com.ekyc.common.exception;

import com.ekyc.common.constants.MessageCodes;

/**
 * Exception thrown when a user already exists
 */
public class UserAlreadyExistsException extends SaaSPlatformException {
    
    public UserAlreadyExistsException() {
        super(MessageCodes.ERROR_USER_ALREADY_EXISTS);
    }
    
    public UserAlreadyExistsException(String message) {
        super(MessageCodes.ERROR_USER_ALREADY_EXISTS, message);
    }
    
    public UserAlreadyExistsException(String message, Throwable cause) {
        super(MessageCodes.ERROR_USER_ALREADY_EXISTS, message, cause);
    }
} 