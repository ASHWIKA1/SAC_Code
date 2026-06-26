package com.sac.erp.modules.homework.repository;

import com.sac.erp.modules.homework.entity.Homework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    List<Homework> findByActiveStatus(Integer activeStatus);
    List<Homework> findByClassIdAndSectionIdAndActiveStatus(Long classId, Long sectionId, Integer activeStatus);
}
