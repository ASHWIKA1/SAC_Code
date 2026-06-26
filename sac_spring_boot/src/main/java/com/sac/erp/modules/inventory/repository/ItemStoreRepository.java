package com.sac.erp.modules.inventory.repository;

import com.sac.erp.modules.inventory.entity.ItemStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemStoreRepository extends JpaRepository<ItemStore, Long> {
    List<ItemStore> findByActiveStatus(Integer activeStatus);
}
