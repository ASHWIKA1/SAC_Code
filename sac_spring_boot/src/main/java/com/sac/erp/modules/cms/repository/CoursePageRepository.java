package com.sac.erp.modules.cms.repository;

import com.sac.erp.modules.cms.entity.CoursePage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CoursePageRepository extends JpaRepository<CoursePage, Long> {
    List<CoursePage> findByActiveStatus(Integer activeStatus);
}
