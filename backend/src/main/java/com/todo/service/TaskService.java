package com.todo.service;

import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.dto.TaskStatsResponse;

import java.util.List;

public interface TaskService {

    List<TaskResponse> getAllTasks(String status, String priority, String search, String sortBy, String sortDirection);

    TaskResponse getTaskById(Long id);

    TaskResponse createTask(TaskRequest request);

    TaskResponse updateTask(Long id, TaskRequest request);

    TaskResponse markAsCompleted(Long id);

    TaskResponse toggleTaskStatus(Long id);

    void deleteTask(Long id);

    TaskStatsResponse getTaskStats();
}
