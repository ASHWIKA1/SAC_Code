package com.sac.erp.modules.academic.repository;

import com.sac.erp.modules.academic.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByActiveStatus(Integer activeStatus);
    java.util.Optional<Section> findBySectionName(String sectionName);
}
