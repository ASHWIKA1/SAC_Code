package com.sac.erp.modules.library.service;

import com.sac.erp.modules.library.entity.BookBank;
import java.util.List;

public interface BookBankService {
    List<BookBank> getAll();
    BookBank getById(Long id);
    BookBank create(BookBank entity);
    BookBank update(Long id, BookBank entity);
    void delete(Long id);
}
