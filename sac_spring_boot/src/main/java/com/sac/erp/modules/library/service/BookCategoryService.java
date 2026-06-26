package com.sac.erp.modules.library.service;

import com.sac.erp.modules.library.entity.BookCategory;
import java.util.List;

public interface BookCategoryService {
    List<BookCategory> getAll();
    BookCategory getById(Long id);
    BookCategory create(BookCategory entity);
    BookCategory update(Long id, BookCategory entity);
    void delete(Long id);
}
