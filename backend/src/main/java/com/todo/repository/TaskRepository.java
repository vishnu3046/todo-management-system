package com.todo.repository;

import com.todo.model.Priority;
import com.todo.model.Task;
import com.todo.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findAllByOrderByCreatedAtDesc();

    List<Task> findByStatusOrderByDueDateAsc(TaskStatus status);

    List<Task> findByTitleContainingIgnoreCase(String title);

    long countByStatus(TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status AND t.dueDate < :date")
    long countOverdueTasks(@Param("status") TaskStatus status, @Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Task> searchTasks(@Param("status") TaskStatus status,
                           @Param("priority") Priority priority,
                           @Param("search") String search);
}
