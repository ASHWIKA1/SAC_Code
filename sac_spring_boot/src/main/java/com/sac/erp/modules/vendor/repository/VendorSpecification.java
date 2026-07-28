package com.sac.erp.modules.vendor.repository;

import com.sac.erp.modules.vendor.entity.Vendor;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class VendorSpecification {

    public static Specification<Vendor> filterVendors(
            String vendorCode, String vendorName, String vendorType, String companyName,
            String vendorCategory, String gstNumber, String panNumber, String email,
            String mobile, String city, String state, String country,
            LocalDate startDate, LocalDate endDate, String status, String schoolId) {

        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

            // Scope by schoolId and active (isDeleted = 0)
            if (schoolId != null) {
                predicates.add(cb.equal(root.get("schoolId"), schoolId));
            }
            predicates.add(cb.equal(root.get("isDeleted"), 0));

            if (vendorCode != null && !vendorCode.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("vendorCode")), "%" + vendorCode.trim().toLowerCase() + "%"));
            }
            if (vendorName != null && !vendorName.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("vendorName")), "%" + vendorName.trim().toLowerCase() + "%"));
            }
            if (vendorType != null && !vendorType.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("vendorType"), vendorType.trim()));
            }
            if (companyName != null && !companyName.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("companyName")), "%" + companyName.trim().toLowerCase() + "%"));
            }
            if (vendorCategory != null && !vendorCategory.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("vendorCategory"), vendorCategory.trim()));
            }
            if (gstNumber != null && !gstNumber.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("gstNumber")), "%" + gstNumber.trim().toLowerCase() + "%"));
            }
            if (panNumber != null && !panNumber.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("panNumber")), "%" + panNumber.trim().toLowerCase() + "%"));
            }
            if (email != null && !email.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + email.trim().toLowerCase() + "%"));
            }
            if (mobile != null && !mobile.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("mobile")), "%" + mobile.trim().toLowerCase() + "%"));
            }
            if (city != null && !city.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase()));
            }
            if (state != null && !state.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("state")), state.trim().toLowerCase()));
            }
            if (country != null && !country.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("country")), country.trim().toLowerCase()));
            }
            if (status != null && !status.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase()));
            }

            if (startDate != null) {
                LocalDateTime startDateTime = startDate.atStartOfDay();
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), startDateTime));
            }
            if (endDate != null) {
                LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), endDateTime));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
