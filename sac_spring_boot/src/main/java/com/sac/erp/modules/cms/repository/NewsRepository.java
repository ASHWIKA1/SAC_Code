package com.sac.erp.modules.cms.repository;

import com.sac.erp.modules.cms.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByActiveStatus(Integer activeStatus);
}
