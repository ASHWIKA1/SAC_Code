package com.sac.erp.modules.inventory.repository;

import com.sac.erp.modules.inventory.entity.ItemReceiveChild;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemReceiveChildRepository extends JpaRepository<ItemReceiveChild, Long> {
    List<ItemReceiveChild> findByActiveStatus(Integer activeStatus);
}
