package com.todo.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskStatus {
    PENDING("Pending"),
    COMPLETED("Completed");

    private final String displayName;

    TaskStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static TaskStatus fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return PENDING;
        }
        String clean = value.trim();
        for (TaskStatus s : TaskStatus.values()) {
            if (s.displayName.equalsIgnoreCase(clean) || s.name().equalsIgnoreCase(clean)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Invalid status: " + value + ". Allowed values: Pending, Completed");
    }

    @Override
    public String toString() {
        return displayName;
    }
}
