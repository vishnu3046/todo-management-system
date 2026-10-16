package com.todo.service.impl;

import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.dto.TaskStatsResponse;
import com.todo.exception.ResourceNotFoundException;
import com.todo.model.Priority;
import com.todo.model.Task;
import com.todo.model.TaskStatus;
import com.todo.repository.TaskRepository;
import com.todo.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(String status, String priority, String search, String sortBy, String sortDirection) {
        List<Task> tasks = taskRepository.findAll();

        // Filter by Status (Pending, Completed, or Overdue)
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            if (status.equalsIgnoreCase("OVERDUE")) {
                LocalDate today = LocalDate.now();
                tasks = tasks.stream()
                        .filter(t -> t.getStatus() == TaskStatus.PENDING && t.getDueDate() != null && t.getDueDate().isBefore(today))
                        .collect(Collectors.toList());
            } else {
                try {
                    TaskStatus targetStatus = TaskStatus.fromString(status);
                    tasks = tasks.stream()
                            .filter(t -> t.getStatus() == targetStatus)
                            .collect(Collectors.toList());
                } catch (IllegalArgumentException ignored) {
                }
            }
        }

        // Filter by Priority
        if (priority != null && !priority.trim().isEmpty() && !priority.equalsIgnoreCase("ALL")) {
            try {
                Priority targetPriority = Priority.fromString(priority);
                tasks = tasks.stream()
                        .filter(t -> t.getPriority() == targetPriority)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException ignored) {
            }
        }

        // Filter by Search (Title or Description)
        if (search != null && !search.trim().isEmpty()) {
            String lowerSearch = search.trim().toLowerCase();
            tasks = tasks.stream()
                    .filter(t -> (t.getTitle() != null && t.getTitle().toLowerCase().contains(lowerSearch)) ||
                                 (t.getDescription() != null && t.getDescription().toLowerCase().contains(lowerSearch)))
                    .collect(Collectors.toList());
        }

        // Sorting
        Comparator<Task> comparator;
        String sortField = sortBy != null ? sortBy.trim().toLowerCase() : "createdat";

        switch (sortField) {
            case "duedate":
            case "due_date":
                comparator = Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
            case "priority":
                // High > Medium > Low
                comparator = Comparator.comparingInt(t -> {
                    if (t.getPriority() == Priority.HIGH) return 1;
                    if (t.getPriority() == Priority.MEDIUM) return 2;
                    return 3;
                });
                break;
            case "title":
                comparator = Comparator.comparing(t -> t.getTitle().toLowerCase());
                break;
            case "createdat":
            case "created_at":
            default:
                comparator = Comparator.comparing(Task::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
        }

        boolean isAscending = sortDirection != null && sortDirection.equalsIgnoreCase("asc");
        if (!isAscending && !sortField.equals("priority")) {
            comparator = comparator.reversed();
        } else if (!isAscending && sortField.equals("priority")) {
            // Already 1: High, 2: Medium, 3: Low for descending importance
        } else if (isAscending && sortField.equals("priority")) {
            comparator = comparator.reversed();
        }

        tasks.sort(comparator);

        return tasks.stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return TaskResponse.fromEntity(task);
    }

    @Override
    public TaskResponse createTask(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING);

        Task savedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    @Override
    public TaskResponse markAsCompleted(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setStatus(TaskStatus.COMPLETED);
        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    @Override
    public TaskResponse toggleTaskStatus(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (task.getStatus() == TaskStatus.COMPLETED) {
            task.setStatus(TaskStatus.PENDING);
        } else {
            task.setStatus(TaskStatus.COMPLETED);
        }

        Task updatedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        taskRepository.delete(task);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskStatsResponse getTaskStats() {
        long total = taskRepository.count();
        long pending = taskRepository.countByStatus(TaskStatus.PENDING);
        long completed = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long overdue = taskRepository.countOverdueTasks(TaskStatus.PENDING, LocalDate.now());

        return new TaskStatsResponse(total, pending, completed, overdue);
    }
}
