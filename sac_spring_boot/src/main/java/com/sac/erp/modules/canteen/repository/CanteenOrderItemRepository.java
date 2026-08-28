package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanteenOrderItemRepository extends JpaRepository<CanteenOrderItem, Long> {
    List<CanteenOrderItem> findByOrderId(Long orderId);
}
