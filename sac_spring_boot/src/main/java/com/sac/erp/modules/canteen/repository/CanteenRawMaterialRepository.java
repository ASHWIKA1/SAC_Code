package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenRawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanteenRawMaterialRepository extends JpaRepository<CanteenRawMaterial, Long> {
}
