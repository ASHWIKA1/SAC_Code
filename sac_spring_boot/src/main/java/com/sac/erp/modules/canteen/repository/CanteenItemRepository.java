package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanteenItemRepository extends JpaRepository<CanteenItem, Long> {
}
