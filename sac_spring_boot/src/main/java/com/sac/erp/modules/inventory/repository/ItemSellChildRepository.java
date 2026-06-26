package com.sac.erp.modules.inventory.repository;

import com.sac.erp.modules.inventory.entity.ItemSellChild;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemSellChildRepository extends JpaRepository<ItemSellChild, Long> {
    List<ItemSellChild> findByActiveStatus(Integer activeStatus);
}
