package com.sac.erp.modules.admin.service;

import com.sac.erp.modules.admin.entity.*;
import java.util.List;

public interface AdminService {
    List<Complaint> getAllComplaints();
    Complaint createComplaint(Complaint complaint);

    List<Visitor> getAllVisitors();
    Visitor recordVisitor(Visitor visitor);

    List<PostalLog> getAllPostalLogs();
    PostalLog recordPostalLog(PostalLog postalLog);
}
