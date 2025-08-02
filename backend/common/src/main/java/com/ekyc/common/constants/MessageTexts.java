package com.ekyc.common.constants;

import java.util.HashMap;
import java.util.Map;

/**
 * Message texts for the SaaS Platform
 * Maps message codes to user-friendly messages
 */
public final class MessageTexts {
    
    private static final Map<String, String> MESSAGE_MAP = new HashMap<>();
    
    static {
        // Success Messages
        MESSAGE_MAP.put(MessageCodes.SUCCESS_USER_CREATED, "User created successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_USER_UPDATED, "User updated successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_USER_DELETED, "User deleted successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_USER_LOGIN, "Login successful");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_USER_LOGOUT, "Logout successful");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_TENANT_CREATED, "Tenant created successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_TENANT_UPDATED, "Tenant updated successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_TENANT_DELETED, "Tenant deleted successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_MODULE_CREATED, "Module created successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_MODULE_UPDATED, "Module updated successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_MODULE_DELETED, "Module deleted successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_SUBSCRIPTION_CREATED, "Subscription created successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_SUBSCRIPTION_UPDATED, "Subscription updated successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_SUBSCRIPTION_CANCELLED, "Subscription cancelled successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_PASSWORD_CHANGED, "Password changed successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_EMAIL_VERIFIED, "Email verified successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_PROFILE_UPDATED, "Profile updated successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_ROLE_ASSIGNED, "Role assigned successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_ROLE_REMOVED, "Role removed successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_TENANT_ACTIVATED, "Tenant activated successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_TENANT_DEACTIVATED, "Tenant deactivated successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_MODULE_ACTIVATED, "Module activated successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_MODULE_DEACTIVATED, "Module deactivated successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_SUBSCRIPTION_RENEWED, "Subscription renewed successfully");
        MESSAGE_MAP.put(MessageCodes.SUCCESS_PAYMENT_PROCESSED, "Payment processed successfully");
        
        // Error Messages
        MESSAGE_MAP.put(MessageCodes.ERROR_USER_NOT_FOUND, "User not found");
        MESSAGE_MAP.put(MessageCodes.ERROR_USER_ALREADY_EXISTS, "User with this email already exists");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_CREDENTIALS, "Invalid email or password");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_TOKEN, "Invalid authentication token");
        MESSAGE_MAP.put(MessageCodes.ERROR_TOKEN_EXPIRED, "Authentication token has expired");
        MESSAGE_MAP.put(MessageCodes.ERROR_INSUFFICIENT_PERMISSIONS, "Insufficient permissions to perform this action");
        MESSAGE_MAP.put(MessageCodes.ERROR_TENANT_NOT_FOUND, "Tenant not found");
        MESSAGE_MAP.put(MessageCodes.ERROR_TENANT_ALREADY_EXISTS, "Tenant with this domain already exists");
        MESSAGE_MAP.put(MessageCodes.ERROR_TENANT_INACTIVE, "Tenant account is inactive");
        MESSAGE_MAP.put(MessageCodes.ERROR_MODULE_NOT_FOUND, "Module not found");
        MESSAGE_MAP.put(MessageCodes.ERROR_MODULE_ALREADY_EXISTS, "Module with this name already exists");
        MESSAGE_MAP.put(MessageCodes.ERROR_MODULE_INACTIVE, "Module is currently inactive");
        MESSAGE_MAP.put(MessageCodes.ERROR_SUBSCRIPTION_NOT_FOUND, "Subscription not found");
        MESSAGE_MAP.put(MessageCodes.ERROR_SUBSCRIPTION_ALREADY_EXISTS, "Subscription already exists for this tenant and module");
        MESSAGE_MAP.put(MessageCodes.ERROR_SUBSCRIPTION_EXPIRED, "Subscription has expired");
        MESSAGE_MAP.put(MessageCodes.ERROR_PAYMENT_FAILED, "Payment processing failed");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_EMAIL_FORMAT, "Invalid email format");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_PASSWORD_FORMAT, "Password must be at least 6 characters long");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_DATE_FORMAT, "Invalid date format");
        MESSAGE_MAP.put(MessageCodes.ERROR_REQUIRED_FIELD_MISSING, "Required field is missing");
        MESSAGE_MAP.put(MessageCodes.ERROR_TERMS_NOT_ACCEPTED, "Terms and conditions must be accepted");
        MESSAGE_MAP.put(MessageCodes.ERROR_EMAIL_NOT_VERIFIED, "Email address not verified");
        MESSAGE_MAP.put(MessageCodes.ERROR_ACCOUNT_LOCKED, "Account is locked due to multiple failed login attempts");
        MESSAGE_MAP.put(MessageCodes.ERROR_ACCOUNT_DISABLED, "Account is disabled");
        MESSAGE_MAP.put(MessageCodes.ERROR_RATE_LIMIT_EXCEEDED, "Rate limit exceeded. Please try again later");
        MESSAGE_MAP.put(MessageCodes.ERROR_DATABASE_CONNECTION, "Database connection error");
        MESSAGE_MAP.put(MessageCodes.ERROR_EXTERNAL_SERVICE_UNAVAILABLE, "External service is temporarily unavailable");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_REQUEST_DATA, "Invalid request data");
        MESSAGE_MAP.put(MessageCodes.ERROR_VALIDATION_FAILED, "Validation failed");
        MESSAGE_MAP.put(MessageCodes.ERROR_INTERNAL_SERVER_ERROR, "Internal server error");
        MESSAGE_MAP.put(MessageCodes.ERROR_SERVICE_UNAVAILABLE, "Service is temporarily unavailable");
        MESSAGE_MAP.put(MessageCodes.ERROR_BAD_REQUEST, "Bad request");
        MESSAGE_MAP.put(MessageCodes.ERROR_UNAUTHORIZED, "Unauthorized access");
        MESSAGE_MAP.put(MessageCodes.ERROR_FORBIDDEN, "Access forbidden");
        MESSAGE_MAP.put(MessageCodes.ERROR_NOT_FOUND, "Resource not found");
        MESSAGE_MAP.put(MessageCodes.ERROR_METHOD_NOT_ALLOWED, "Method not allowed");
        MESSAGE_MAP.put(MessageCodes.ERROR_CONFLICT, "Resource conflict");
        MESSAGE_MAP.put(MessageCodes.ERROR_UNSUPPORTED_MEDIA_TYPE, "Unsupported media type");
        MESSAGE_MAP.put(MessageCodes.ERROR_TOO_MANY_REQUESTS, "Too many requests");
        MESSAGE_MAP.put(MessageCodes.ERROR_GATEWAY_TIMEOUT, "Gateway timeout");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_ROLE, "Invalid role specified");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_TENANT, "Invalid tenant specified");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_MODULE, "Invalid module specified");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_SUBSCRIPTION, "Invalid subscription specified");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_USER, "Invalid user specified");
        MESSAGE_MAP.put(MessageCodes.ERROR_INVALID_OPERATION, "Invalid operation");
        MESSAGE_MAP.put(MessageCodes.ERROR_DATA_INTEGRITY_VIOLATION, "Data integrity violation");
        MESSAGE_MAP.put(MessageCodes.ERROR_CONSTRAINT_VIOLATION, "Constraint violation");
        MESSAGE_MAP.put(MessageCodes.ERROR_DUPLICATE_KEY, "Duplicate key violation");
        MESSAGE_MAP.put(MessageCodes.ERROR_UNKNOWN_ERROR, "An unknown error occurred");
    }
    
    /**
     * Get message text for a given code
     * @param code The message code
     * @return The corresponding message text
     */
    public static String getMessage(String code) {
        return MESSAGE_MAP.getOrDefault(code, "Unknown message code: " + code);
    }
    
    /**
     * Check if a code exists
     * @param code The message code
     * @return true if the code exists, false otherwise
     */
    public static boolean hasCode(String code) {
        return MESSAGE_MAP.containsKey(code);
    }
    
    private MessageTexts() {
        // Private constructor to prevent instantiation
    }
} 