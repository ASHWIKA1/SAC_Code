package com.sac.erp.modules.transport.repository;

import com.sac.erp.modules.transport.entity.AssignVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignVehicleRepository extends JpaRepository<AssignVehicle, Long> {
    List<AssignVehicle> findByActiveStatus(Integer activeStatus);
    List<AssignVehicle> findByRouteIdAndActiveStatus(Long routeId, Integer activeStatus);
}
