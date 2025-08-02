package com.ekyc.common.constants;

/**
 * Message codes for the SaaS Platform
 * Format: KP-XX where XX is a sequential number
 */
public final class MessageCodes {
    
    // Success Codes (KP-01 to KP-49)
    public static final String SUCCESS_USER_CREATED = "KP-01";
    public static final String SUCCESS_USER_UPDATED = "KP-02";
    public static final String SUCCESS_USER_DELETED = "KP-03";
    public static final String SUCCESS_USER_LOGIN = "KP-04";
    public static final String SUCCESS_USER_LOGOUT = "KP-05";
    public static final String SUCCESS_TENANT_CREATED = "KP-06";
    public static final String SUCCESS_TENANT_UPDATED = "KP-07";
    public static final String SUCCESS_TENANT_DELETED = "KP-08";
    public static final String SUCCESS_MODULE_CREATED = "KP-09";
    public static final String SUCCESS_MODULE_UPDATED = "KP-10";
    public static final String SUCCESS_MODULE_DELETED = "KP-11";
    public static final String SUCCESS_SUBSCRIPTION_CREATED = "KP-12";
    public static final String SUCCESS_SUBSCRIPTION_UPDATED = "KP-13";
    public static final String SUCCESS_SUBSCRIPTION_CANCELLED = "KP-14";
    public static final String SUCCESS_PASSWORD_CHANGED = "KP-15";
    public static final String SUCCESS_EMAIL_VERIFIED = "KP-16";
    public static final String SUCCESS_PROFILE_UPDATED = "KP-17";
    public static final String SUCCESS_ROLE_ASSIGNED = "KP-18";
    public static final String SUCCESS_ROLE_REMOVED = "KP-19";
    public static final String SUCCESS_TENANT_ACTIVATED = "KP-20";
    public static final String SUCCESS_TENANT_DEACTIVATED = "KP-21";
    public static final String SUCCESS_MODULE_ACTIVATED = "KP-22";
    public static final String SUCCESS_MODULE_DEACTIVATED = "KP-23";
    public static final String SUCCESS_SUBSCRIPTION_RENEWED = "KP-24";
    public static final String SUCCESS_PAYMENT_PROCESSED = "KP-25";
    
    // Error Codes (KP-50 to KP-99)
    public static final String ERROR_USER_NOT_FOUND = "KP-50";
    public static final String ERROR_USER_ALREADY_EXISTS = "KP-51";
    public static final String ERROR_INVALID_CREDENTIALS = "KP-52";
    public static final String ERROR_INVALID_TOKEN = "KP-53";
    public static final String ERROR_TOKEN_EXPIRED = "KP-54";
    public static final String ERROR_INSUFFICIENT_PERMISSIONS = "KP-55";
    public static final String ERROR_TENANT_NOT_FOUND = "KP-56";
    public static final String ERROR_TENANT_ALREADY_EXISTS = "KP-57";
    public static final String ERROR_TENANT_INACTIVE = "KP-58";
    public static final String ERROR_MODULE_NOT_FOUND = "KP-59";
    public static final String ERROR_MODULE_ALREADY_EXISTS = "KP-60";
    public static final String ERROR_MODULE_INACTIVE = "KP-61";
    public static final String ERROR_SUBSCRIPTION_NOT_FOUND = "KP-62";
    public static final String ERROR_SUBSCRIPTION_ALREADY_EXISTS = "KP-63";
    public static final String ERROR_SUBSCRIPTION_EXPIRED = "KP-64";
    public static final String ERROR_PAYMENT_FAILED = "KP-65";
    public static final String ERROR_INVALID_EMAIL_FORMAT = "KP-66";
    public static final String ERROR_INVALID_PASSWORD_FORMAT = "KP-67";
    public static final String ERROR_INVALID_DATE_FORMAT = "KP-68";
    public static final String ERROR_REQUIRED_FIELD_MISSING = "KP-69";
    public static final String ERROR_TERMS_NOT_ACCEPTED = "KP-70";
    public static final String ERROR_EMAIL_NOT_VERIFIED = "KP-71";
    public static final String ERROR_ACCOUNT_LOCKED = "KP-72";
    public static final String ERROR_ACCOUNT_DISABLED = "KP-73";
    public static final String ERROR_RATE_LIMIT_EXCEEDED = "KP-74";
    public static final String ERROR_DATABASE_CONNECTION = "KP-75";
    public static final String ERROR_EXTERNAL_SERVICE_UNAVAILABLE = "KP-76";
    public static final String ERROR_INVALID_REQUEST_DATA = "KP-77";
    public static final String ERROR_VALIDATION_FAILED = "KP-78";
    public static final String ERROR_INTERNAL_SERVER_ERROR = "KP-79";
    public static final String ERROR_SERVICE_UNAVAILABLE = "KP-80";
    public static final String ERROR_BAD_REQUEST = "KP-81";
    public static final String ERROR_UNAUTHORIZED = "KP-82";
    public static final String ERROR_FORBIDDEN = "KP-83";
    public static final String ERROR_NOT_FOUND = "KP-84";
    public static final String ERROR_METHOD_NOT_ALLOWED = "KP-85";
    public static final String ERROR_CONFLICT = "KP-86";
    public static final String ERROR_UNSUPPORTED_MEDIA_TYPE = "KP-87";
    public static final String ERROR_TOO_MANY_REQUESTS = "KP-88";
    public static final String ERROR_GATEWAY_TIMEOUT = "KP-89";
    public static final String ERROR_INVALID_ROLE = "KP-90";
    public static final String ERROR_INVALID_TENANT = "KP-91";
    public static final String ERROR_INVALID_MODULE = "KP-92";
    public static final String ERROR_INVALID_SUBSCRIPTION = "KP-93";
    public static final String ERROR_INVALID_USER = "KP-94";
    public static final String ERROR_INVALID_OPERATION = "KP-95";
    public static final String ERROR_DATA_INTEGRITY_VIOLATION = "KP-96";
    public static final String ERROR_CONSTRAINT_VIOLATION = "KP-97";
    public static final String ERROR_DUPLICATE_KEY = "KP-98";
    public static final String ERROR_UNKNOWN_ERROR = "KP-99";
    
    private MessageCodes() {
        // Private constructor to prevent instantiation
    }
} 