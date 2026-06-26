package com.sac.erp.modules.superadmin.repository;

import com.sac.erp.modules.superadmin.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {
    Optional<School> findByDomain(String domain);
    Optional<School> findBySchoolCode(String schoolCode);
}
