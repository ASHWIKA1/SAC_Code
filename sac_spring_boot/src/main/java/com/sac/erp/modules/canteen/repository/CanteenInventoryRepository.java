package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CanteenInventoryRepository extends JpaRepository<CanteenInventory, Long> {
    Optional<CanteenInventory> findByItemId(Long itemId);
}
