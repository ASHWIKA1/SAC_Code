package com.sac.erp.modules.canteen.repository;

import com.sac.erp.modules.canteen.entity.CanteenCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CanteenCategoryRepository extends JpaRepository<CanteenCategory, Long> {
}
