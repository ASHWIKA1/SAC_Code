package com.sac.erp.modules.jitsi.repository;

import com.sac.erp.modules.jitsi.entity.JitsiVirtualClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JitsiVirtualClassRepository extends JpaRepository<JitsiVirtualClass, Long> {
    List<JitsiVirtualClass> findByClassIdAndSectionId(Integer classId, String sectionId);
}
