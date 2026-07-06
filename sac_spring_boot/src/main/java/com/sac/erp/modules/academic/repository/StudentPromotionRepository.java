package com.sac.erp.modules.academic.repository;

import com.sac.erp.modules.academic.entity.StudentPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentPromotionRepository extends JpaRepository<StudentPromotion, Long> {
}
