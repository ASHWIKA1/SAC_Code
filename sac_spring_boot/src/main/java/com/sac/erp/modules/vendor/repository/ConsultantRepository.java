package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.Consultant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultantRepository extends JpaRepository<Consultant, Long> {
    List<Consultant> findBySchoolIdAndIsDeleted(String schoolId, Integer isDeleted);

    @Query("SELECT c FROM Consultant c WHERE c.schoolId = :schoolId AND c.isDeleted = 0 AND " +
           "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.specialization) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Consultant> searchConsultants(@Param("schoolId") String schoolId, @Param("search") String search, Pageable pageable);
}
