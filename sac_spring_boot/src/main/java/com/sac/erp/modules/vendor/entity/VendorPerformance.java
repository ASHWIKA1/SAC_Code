package com.sac.erp.modules.vendor.entity;

import com.sac.erp.modules.core.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "sm_vendor_performances")
public class VendorPerformance extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "delivery_performance")
    private BigDecimal deliveryPerformance = BigDecimal.valueOf(5.00);

    @Column(name = "quality_rating")
    private BigDecimal qualityRating = BigDecimal.valueOf(5.00);

    private BigDecimal communication = BigDecimal.valueOf(5.00);

    @Column(name = "response_time")
    private BigDecimal responseTime = BigDecimal.valueOf(5.00);

    private BigDecimal pricing = BigDecimal.valueOf(5.00);

    @Column(name = "complaint_count")
    private Integer complaintCount = 0;

    @Column(name = "rejected_materials")
    private Integer rejectedMaterials = 0;

    private BigDecimal compliance = BigDecimal.valueOf(5.00);

    @Column(name = "overall_rating")
    private BigDecimal overallRating = BigDecimal.valueOf(5.00);

    @Column(name = "rating_level")
    private String ratingLevel = "Good"; // Excellent, Good, Average, Poor

    @Column(name = "blacklist_recommendation")
    private Boolean blacklistRecommendation = false;

    private String feedback;

    @Column(name = "school_id")
    private String schoolId = "1";

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;
}
