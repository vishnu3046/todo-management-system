package com.todo.service;

import com.todo.dto.TaskRequest;
import com.todo.dto.TaskResponse;
import com.todo.dto.TaskStatsResponse;
import com.todo.exception.ResourceNotFoundException;
import com.todo.model.Priority;
import com.todo.model.Task;
import com.todo.model.TaskStatus;
import com.todo.repository.TaskRepository;
import com.todo.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = new Task();
        sampleTask.setId(1L);
        sampleTask.setTitle("Complete Full Stack Assignment");
        sampleTask.setDescription("Build React frontend and Spring Boot backend");
        sampleTask.setDueDate(LocalDate.now().plusDays(2));
        sampleTask.setPriority(Priority.HIGH);
        sampleTask.setStatus(TaskStatus.PENDING);
        sampleTask.setCreatedAt(LocalDateTime.now().minusHours(1));
        sampleTask.setUpdatedAt(LocalDateTime.now().minusHours(1));
    }

    @Test
    void testGetTaskById_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));

        TaskResponse response = taskService.getTaskById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Complete Full Stack Assignment", response.getTitle());
        assertEquals(Priority.HIGH, response.getPriority());
        assertEquals(TaskStatus.PENDING, response.getStatus());
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    void testGetTaskById_NotFound() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(99L));
        verify(taskRepository, times(1)).findById(99L);
    }

    @Test
    void testCreateTask() {
        TaskRequest request = new TaskRequest(
                "New Task",
                "Description",
                LocalDate.now().plusDays(1),
                Priority.MEDIUM,
                TaskStatus.PENDING
        );

        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task t = invocation.getArgument(0);
            t.setId(10L);
            t.setCreatedAt(LocalDateTime.now());
            return t;
        });

        TaskResponse response = taskService.createTask(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("New Task", response.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void testUpdateTask_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskRequest updateRequest = new TaskRequest(
                "Updated Title",
                "Updated Desc",
                LocalDate.now().plusDays(5),
                Priority.LOW,
                TaskStatus.COMPLETED
        );

        TaskResponse response = taskService.updateTask(1L, updateRequest);

        assertNotNull(response);
        assertEquals("Updated Title", response.getTitle());
        assertEquals(Priority.LOW, response.getPriority());
        assertEquals(TaskStatus.COMPLETED, response.getStatus());
    }

    @Test
    void testMarkAsCompleted() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskResponse response = taskService.markAsCompleted(1L);

        assertNotNull(response);
        assertEquals(TaskStatus.COMPLETED, response.getStatus());
        verify(taskRepository, times(1)).save(sampleTask);
    }

    @Test
    void testToggleTaskStatus() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        // From PENDING -> COMPLETED
        TaskResponse response = taskService.toggleTaskStatus(1L);
        assertEquals(TaskStatus.COMPLETED, response.getStatus());

        // From COMPLETED -> PENDING
        response = taskService.toggleTaskStatus(1L);
        assertEquals(TaskStatus.PENDING, response.getStatus());
    }

    @Test
    void testDeleteTask_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        doNothing().when(taskRepository).delete(sampleTask);

        assertDoesNotThrow(() -> taskService.deleteTask(1L));
        verify(taskRepository, times(1)).delete(sampleTask);
    }

    @Test
    void testGetTaskStats() {
        when(taskRepository.count()).thenReturn(10L);
        when(taskRepository.countByStatus(TaskStatus.PENDING)).thenReturn(6L);
        when(taskRepository.countByStatus(TaskStatus.COMPLETED)).thenReturn(4L);
        when(taskRepository.countOverdueTasks(eq(TaskStatus.PENDING), any(LocalDate.class))).thenReturn(2L);

        TaskStatsResponse stats = taskService.getTaskStats();

        assertNotNull(stats);
        assertEquals(10L, stats.getTotalTasks());
        assertEquals(6L, stats.getPendingTasks());
        assertEquals(4L, stats.getCompletedTasks());
        assertEquals(2L, stats.getOverdueTasks());
        assertEquals(40.0, stats.getCompletionRate());
    }

    @Test
    void testGetAllTasks_WithFiltersAndSearch() {
        Task task2 = new Task("Review documentation", "Read API docs", LocalDate.now().minusDays(1), Priority.LOW, TaskStatus.PENDING);
        task2.setId(2L);
        task2.setCreatedAt(LocalDateTime.now().minusDays(1));

        when(taskRepository.findAll()).thenReturn(Arrays.asList(sampleTask, task2));

        // Search for "Assignment"
        List<TaskResponse> results = taskService.getAllTasks(null, null, "Assignment", "title", "asc");
        assertEquals(1, results.size());
        assertEquals("Complete Full Stack Assignment", results.get(0).getTitle());

        // Filter by overdue
        List<TaskResponse> overdueResults = taskService.getAllTasks("OVERDUE", null, null, null, null);
        assertEquals(1, overdueResults.size());
        assertEquals(2L, overdueResults.get(0).getId());
    }
}
