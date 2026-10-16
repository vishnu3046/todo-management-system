package com.todo.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Priority {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High");

    private final String displayName;

    Priority(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static Priority fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return MEDIUM;
        }
        String clean = value.trim();
        for (Priority p : Priority.values()) {
            if (p.displayName.equalsIgnoreCase(clean) || p.name().equalsIgnoreCase(clean)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Invalid priority: " + value + ". Allowed values: Low, Medium, High");
    }

    @Override
    public String toString() {
        return displayName;
    }
}
