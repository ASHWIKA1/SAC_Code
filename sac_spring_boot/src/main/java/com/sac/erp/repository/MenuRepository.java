package com.sac.erp.repository;

import com.sac.erp.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByStatusAndMenuStatusOrderByPositionAsc(Integer status, Integer menuStatus);
    List<Menu> findByParentIdAndStatusOrderByPositionAsc(Long parentId, Integer status);
}
