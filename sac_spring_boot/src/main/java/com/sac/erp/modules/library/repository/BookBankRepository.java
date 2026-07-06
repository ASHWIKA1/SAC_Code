package com.sac.erp.modules.library.repository;

import com.sac.erp.modules.library.entity.BookBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookBankRepository extends JpaRepository<BookBank, Long> {
}
