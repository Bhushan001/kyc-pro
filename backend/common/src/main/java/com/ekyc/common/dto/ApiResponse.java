package com.ekyc.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ekyc.common.constants.MessageCodes;
import com.ekyc.common.constants.MessageTexts;

/**
 * Standardized API response for all services
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    private String code;
    private String message;
    private T data;
    private boolean success;
    private long timestamp;
    
    public ApiResponse() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public ApiResponse(String code, String message, T data, boolean success) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.success = success;
        this.timestamp = System.currentTimeMillis();
    }
    
    /**
     * Create a success response
     */
    public static <T> ApiResponse<T> success(String code, T data) {
        return new ApiResponse<>(code, MessageTexts.getMessage(code), data, true);
    }
    
    /**
     * Create a success response with custom message
     */
    public static <T> ApiResponse<T> success(String code, String message, T data) {
        return new ApiResponse<>(code, message, data, true);
    }
    
    /**
     * Create an error response
     */
    public static <T> ApiResponse<T> error(String code) {
        return new ApiResponse<>(code, MessageTexts.getMessage(code), null, false);
    }
    
    /**
     * Create an error response with custom message
     */
    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(code, message, null, false);
    }
    
    /**
     * Create a simple success response
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(MessageCodes.SUCCESS_USER_CREATED, "Success", data, true);
    }
    
    /**
     * Create a simple error response
     */
    public static <T> ApiResponse<T> error(String code, String message, T data) {
        return new ApiResponse<>(code, message, data, false);
    }
    
    // Getters and Setters
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
} 