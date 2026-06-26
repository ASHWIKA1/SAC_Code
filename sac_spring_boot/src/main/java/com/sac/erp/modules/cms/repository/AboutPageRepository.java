package com.sac.erp.modules.cms.repository;

import com.sac.erp.modules.cms.entity.AboutPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AboutPageRepository extends JpaRepository<AboutPage, Long> {
    List<AboutPage> findByActiveStatus(Integer activeStatus);
}
