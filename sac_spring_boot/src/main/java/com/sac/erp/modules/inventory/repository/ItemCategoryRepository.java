package com.sac.erp.modules.inventory.repository;

import com.sac.erp.modules.inventory.entity.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemCategoryRepository extends JpaRepository<ItemCategory, Long> {
    List<ItemCategory> findByActiveStatus(Integer activeStatus);
}
