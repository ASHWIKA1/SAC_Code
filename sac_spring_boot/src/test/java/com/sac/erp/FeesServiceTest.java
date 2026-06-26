package com.sac.erp;

import com.sac.erp.modules.fees.entity.FeesGroup;
import com.sac.erp.modules.fees.entity.FeesMaster;
import com.sac.erp.modules.fees.entity.FeesPayment;
import com.sac.erp.modules.fees.entity.FeesType;
import com.sac.erp.modules.fees.repository.FeesDiscountRepository;
import com.sac.erp.modules.fees.repository.FeesGroupRepository;
import com.sac.erp.modules.fees.repository.FeesMasterRepository;
import com.sac.erp.modules.fees.repository.FeesPaymentRepository;
import com.sac.erp.modules.fees.repository.FeesTypeRepository;
import com.sac.erp.modules.fees.service.FeesServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class FeesServiceTest {

    @Mock
    private FeesGroupRepository feesGroupRepository;
    @Mock
    private FeesTypeRepository feesTypeRepository;
    @Mock
    private FeesMasterRepository feesMasterRepository;
    @Mock
    private FeesDiscountRepository feesDiscountRepository;
    @Mock
    private FeesPaymentRepository feesPaymentRepository;

    @InjectMocks
    private FeesServiceImpl feesService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllFeesGroups() {
        List<FeesGroup> list = new ArrayList<>();
        FeesGroup fg = new FeesGroup();
        fg.setName("Tuition Fee");
        fg.setActiveStatus(1);
        list.add(fg);

        when(feesGroupRepository.findByActiveStatus(1)).thenReturn(list);

        List<FeesGroup> result = feesService.getAllFeesGroups();
        assertEquals(1, result.size());
        assertEquals("Tuition Fee", result.get(0).getName());
    }

    @Test
    void testCollectPayment() {
        FeesPayment payment = new FeesPayment();
        payment.setStudentId(1L);
        payment.setAmount(1200.0);
        payment.setPaymentMode("Cash");

        when(feesPaymentRepository.save(any(FeesPayment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FeesPayment saved = feesService.collectPayment(payment);

        assertNotNull(saved);
        assertEquals(1200.0, saved.getAmount());
        assertEquals("Cash", saved.getPaymentMode());
        assertEquals(LocalDate.now(), saved.getPaymentDate());
        verify(feesPaymentRepository, times(1)).save(payment);
    }
}
