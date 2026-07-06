package com.sac.erp.modules.homework.repository;

import com.sac.erp.modules.homework.entity.HomeworkStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomeworkStudentRepository extends JpaRepository<HomeworkStudent, Long> {
    List<HomeworkStudent> findByHomeworkId(Long homeworkId);
    Optional<HomeworkStudent> findByHomeworkIdAndStudentId(Long homeworkId, Long studentId);
}
