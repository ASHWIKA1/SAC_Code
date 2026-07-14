package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.LmsLiveClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LmsLiveClassRepository extends JpaRepository<LmsLiveClass, Long> {
    List<LmsLiveClass> findByCourseId(Long courseId);
}
