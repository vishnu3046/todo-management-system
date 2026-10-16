package com.todo.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PriorityConverter implements AttributeConverter<Priority, String> {

    @Override
    public String convertToDatabaseColumn(Priority attribute) {
        if (attribute == null) {
            return Priority.MEDIUM.getDisplayName();
        }
        return attribute.getDisplayName();
    }

    @Override
    public Priority convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return Priority.MEDIUM;
        }
        return Priority.fromString(dbData);
    }
}
