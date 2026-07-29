package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanteenOrderRepository extends JpaRepository<CanteenOrder, Long> {
    List<CanteenOrder> findByCardUid(String cardUid);
}
