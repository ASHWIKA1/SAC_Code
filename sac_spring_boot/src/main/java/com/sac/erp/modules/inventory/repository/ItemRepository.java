package com.sac.erp.modules.inventory.repository;

import com.sac.erp.modules.inventory.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByActiveStatus(Integer activeStatus);
}
