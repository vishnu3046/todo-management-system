package com.todo.controller;

import com.todo.dto.ApiResponse;
import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.dto.TaskStatsResponse;
import com.todo.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * GET /api/tasks - Retrieve all tasks with optional filters and sorting
     */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDirection) {
        List<TaskResponse> tasks = taskService.getAllTasks(status, priority, search, sortBy, sortDirection);
        return ResponseEntity.ok(tasks);
    }

    /**
     * GET /api/tasks/stats - Retrieve dashboard task statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<TaskStatsResponse> getTaskStats() {
        TaskStatsResponse stats = taskService.getTaskStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/tasks/{id} - Retrieve a task by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        TaskResponse task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    /**
     * POST /api/tasks - Create a new task
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        TaskResponse createdTask = taskService.createTask(request);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    /**
     * PUT /api/tasks/{id} - Update an existing task
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        TaskResponse updatedTask = taskService.updateTask(id, request);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * PATCH /api/tasks/{id}/complete - Mark a task as completed
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> markAsCompleted(@PathVariable Long id) {
        TaskResponse updatedTask = taskService.markAsCompleted(id);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * PATCH /api/tasks/{id}/toggle - Toggle task status between Pending and Completed
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TaskResponse> toggleTaskStatus(@PathVariable Long id) {
        TaskResponse updatedTask = taskService.toggleTaskStatus(id);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * DELETE /api/tasks/{id} - Delete a task
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully"));
    }
}
