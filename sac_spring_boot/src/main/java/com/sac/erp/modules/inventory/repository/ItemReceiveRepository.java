package com.sac.erp.modules.inventory.repository;

import com.sac.erp.modules.inventory.entity.ItemReceive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemReceiveRepository extends JpaRepository<ItemReceive, Long> {
    List<ItemReceive> findByActiveStatus(Integer activeStatus);
}
