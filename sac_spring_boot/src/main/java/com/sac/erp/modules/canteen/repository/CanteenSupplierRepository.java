package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenSupplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanteenSupplierRepository extends JpaRepository<CanteenSupplier, Long> {
}
