package com.saasplatform.common;

/**
 * Sample shared DTO for demonstration.
 */
public class SharedDto {
    private String message;

    public SharedDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
