package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenRestriction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanteenRestrictionRepository extends JpaRepository<CanteenRestriction, Long> {
    List<CanteenRestriction> findByStudentIdAndIsActive(Long studentId, Integer isActive);
}
