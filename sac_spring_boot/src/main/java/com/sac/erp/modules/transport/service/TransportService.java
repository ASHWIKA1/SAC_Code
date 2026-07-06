package com.sac.erp.modules.transport.service;

import com.sac.erp.modules.transport.entity.*;
import java.util.List;

public interface TransportService {
    List<Route> getAllRoutes();
    Route createRoute(Route route);

    List<Vehicle> getAllVehicles();
    Vehicle createVehicle(Vehicle vehicle);

    List<AssignVehicle> getAllAssignedVehicles();
    AssignVehicle assignVehicle(Long routeId, Long vehicleId);
}
