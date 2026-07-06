package com.sac.erp.modules.cms.repository;

import com.sac.erp.modules.cms.entity.ContactPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactPageRepository extends JpaRepository<ContactPage, Long> {
    List<ContactPage> findByActiveStatus(Integer activeStatus);
}
