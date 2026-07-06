package com.sac.erp.modules.zoom.repository;

import com.sac.erp.modules.zoom.entity.ZoomVirtualClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoomVirtualClassRepository extends JpaRepository<ZoomVirtualClass, Long> {
    List<ZoomVirtualClass> findByClassIdAndSectionId(Long classId, Long sectionId);
    List<ZoomVirtualClass> findByStatus(Integer status);
}
