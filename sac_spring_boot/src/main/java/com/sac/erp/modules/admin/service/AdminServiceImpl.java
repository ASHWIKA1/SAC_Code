package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.*;
import com.sac.erp.modules.admin.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ComplaintRepository complaintRepository;
    private final VisitorRepository visitorRepository;
    private final PostalLogRepository postalLogRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Complaint createComplaint(Complaint complaint) {
        if (complaint.getDate() == null) {
            complaint.setDate(LocalDate.now());
        }
        return complaintRepository.save(complaint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Visitor> getAllVisitors() {
        return visitorRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Visitor recordVisitor(Visitor visitor) {
        if (visitor.getDate() == null) {
            visitor.setDate(LocalDate.now());
        }
        return visitorRepository.save(visitor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostalLog> getAllPostalLogs() {
        return postalLogRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public PostalLog recordPostalLog(PostalLog postalLog) {
        if (postalLog.getDate() == null) {
            postalLog.setDate(LocalDate.now());
        }
        return postalLogRepository.save(postalLog);
    }
}
