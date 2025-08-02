package com.ekyc.common.exception;

import com.ekyc.common.constants.MessageCodes;
import com.ekyc.common.constants.MessageTexts;

/**
 * Base exception class for the SaaS Platform
 * Includes message codes and user-friendly messages
 */
public class SaaSPlatformException extends RuntimeException {
    
    private final String errorCode;
    private final String userMessage;
    
    /**
     * Constructor with error code
     * @param errorCode The error code from MessageCodes
     */
    public SaaSPlatformException(String errorCode) {
        super(MessageTexts.getMessage(errorCode));
        this.errorCode = errorCode;
        this.userMessage = MessageTexts.getMessage(errorCode);
    }
    
    /**
     * Constructor with error code and custom message
     * @param errorCode The error code from MessageCodes
     * @param message Custom error message
     */
    public SaaSPlatformException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.userMessage = message;
    }
    
    /**
     * Constructor with error code and cause
     * @param errorCode The error code from MessageCodes
     * @param cause The cause of the exception
     */
    public SaaSPlatformException(String errorCode, Throwable cause) {
        super(MessageTexts.getMessage(errorCode), cause);
        this.errorCode = errorCode;
        this.userMessage = MessageTexts.getMessage(errorCode);
    }
    
    /**
     * Constructor with error code, custom message, and cause
     * @param errorCode The error code from MessageCodes
     * @param message Custom error message
     * @param cause The cause of the exception
     */
    public SaaSPlatformException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.userMessage = message;
    }
    
    /**
     * Get the error code
     * @return The error code
     */
    public String getErrorCode() {
        return errorCode;
    }
    
    /**
     * Get the user-friendly message
     * @return The user message
     */
    public String getUserMessage() {
        return userMessage;
    }
    
    /**
     * Check if this is a specific error code
     * @param code The error code to check
     * @return true if the error code matches
     */
    public boolean isErrorCode(String code) {
        return errorCode.equals(code);
    }
} 