package com.sac.erp.modules.inventory.repository;

import com.sac.erp.modules.inventory.entity.ItemSell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemSellRepository extends JpaRepository<ItemSell, Long> {
    List<ItemSell> findByActiveStatus(Integer activeStatus);
}
