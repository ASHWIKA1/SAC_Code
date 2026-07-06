package com.sac.erp.modules.cms.repository;

import com.sac.erp.modules.cms.entity.NewsPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NewsPageRepository extends JpaRepository<NewsPage, Long> {
    List<NewsPage> findByActiveStatus(Integer activeStatus);
}
