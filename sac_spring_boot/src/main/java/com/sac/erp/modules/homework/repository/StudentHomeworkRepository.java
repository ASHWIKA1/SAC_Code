package com.sac.erp.modules.homework.repository;

import com.sac.erp.modules.homework.entity.StudentHomework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentHomeworkRepository extends JpaRepository<StudentHomework, Long> {
}
