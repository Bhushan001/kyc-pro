package com.ekyc.common.util;

import com.ekyc.common.constants.MessageCodes;
import com.ekyc.common.exception.ValidationException;

import java.util.regex.Pattern;

/**
 * Utility class for common validation operations
 */
public class ValidationUtils {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );
    
    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Validate email and throw exception if invalid
     */
    public static void validateEmail(String email) {
        if (!isValidEmail(email)) {
            throw new ValidationException(MessageCodes.ERROR_INVALID_EMAIL_FORMAT, 
                "Invalid email format: " + email);
        }
    }
    
    /**
     * Validate password strength
     */
    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 6;
    }
    
    /**
     * Validate password and throw exception if invalid
     */
    public static void validatePassword(String password) {
        if (!isValidPassword(password)) {
            throw new ValidationException(MessageCodes.ERROR_INVALID_PASSWORD_FORMAT, 
                "Password must be at least 6 characters long");
        }
    }
    
    /**
     * Validate required field
     */
    public static void validateRequired(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new ValidationException(MessageCodes.ERROR_REQUIRED_FIELD_MISSING, 
                "Required field missing: " + fieldName);
        }
    }
    
    /**
     * Validate required field with custom message
     */
    public static void validateRequired(String value, String fieldName, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new ValidationException(MessageCodes.ERROR_REQUIRED_FIELD_MISSING, message);
        }
    }
    
    /**
     * Validate date format
     */
    public static boolean isValidDate(String date) {
        if (date == null || date.trim().isEmpty()) {
            return false;
        }
        try {
            java.time.LocalDate.parse(date);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Validate date and throw exception if invalid
     */
    public static void validateDate(String date, String fieldName) {
        if (!isValidDate(date)) {
            throw new ValidationException(MessageCodes.ERROR_INVALID_DATE_FORMAT, 
                "Invalid date format for field: " + fieldName);
        }
    }
    
    /**
     * Validate terms acceptance
     */
    public static void validateTermsAccepted(String termsAccepted) {
        if (!"true".equals(termsAccepted)) {
            throw new ValidationException(MessageCodes.ERROR_TERMS_NOT_ACCEPTED, 
                "Terms and conditions must be accepted");
        }
    }
    
    /**
     * Validate role
     */
    public static boolean isValidRole(String role) {
        return role != null && (
            "PLATFORM_ADMIN".equals(role) || 
            "PLATFORM_TENANT_ADMIN".equals(role) || 
            "PLATFORM_USER".equals(role)
        );
    }
    
    /**
     * Validate role and throw exception if invalid
     */
    public static void validateRole(String role) {
        if (!isValidRole(role)) {
            throw new ValidationException(MessageCodes.ERROR_INVALID_ROLE, 
                "Invalid role: " + role);
        }
    }
    
    /**
     * Validate UUID format
     */
    public static boolean isValidUUID(String uuid) {
        if (uuid == null) {
            return false;
        }
        try {
            java.util.UUID.fromString(uuid);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Validate UUID and throw exception if invalid
     */
    public static void validateUUID(String uuid, String fieldName) {
        if (!isValidUUID(uuid)) {
            throw new ValidationException(MessageCodes.ERROR_INVALID_REQUEST_DATA, 
                "Invalid UUID format for field: " + fieldName);
        }
    }
    
    /**
     * Validate string length
     */
    public static void validateStringLength(String value, String fieldName, int minLength, int maxLength) {
        if (value != null) {
            int length = value.length();
            if (length < minLength || length > maxLength) {
                throw new ValidationException(MessageCodes.ERROR_VALIDATION_FAILED, 
                    String.format("Field %s must be between %d and %d characters", fieldName, minLength, maxLength));
            }
        }
    }
    
    /**
     * Validate numeric range
     */
    public static void validateNumericRange(Number value, String fieldName, Number min, Number max) {
        if (value != null) {
            double doubleValue = value.doubleValue();
            if (doubleValue < min.doubleValue() || doubleValue > max.doubleValue()) {
                throw new ValidationException(MessageCodes.ERROR_VALIDATION_FAILED, 
                    String.format("Field %s must be between %s and %s", fieldName, min, max));
            }
        }
    }
} 