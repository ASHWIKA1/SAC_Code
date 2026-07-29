package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenRecipeBom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanteenRecipeBomRepository extends JpaRepository<CanteenRecipeBom, Long> {
    List<CanteenRecipeBom> findByMenuItemId(Long menuItemId);
}
