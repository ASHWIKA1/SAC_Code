package com.sac.erp.modules.lms.repository;

import com.sac.erp.modules.lms.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MediaTypeRepository extends JpaRepository<MediaType, Long> {
    Optional<MediaType> findByNameIgnoreCase(String name);
}
