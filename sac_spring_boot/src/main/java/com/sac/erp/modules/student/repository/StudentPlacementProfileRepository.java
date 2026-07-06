package com.sac.erp.modules.student.repository;

import com.sac.erp.modules.student.entity.StudentPlacementProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentPlacementProfileRepository extends JpaRepository<StudentPlacementProfile, Long> {
}
