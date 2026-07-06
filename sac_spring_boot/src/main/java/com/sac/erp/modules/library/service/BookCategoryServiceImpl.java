package com.sac.erp.modules.library.service;

import com.sac.erp.modules.library.entity.BookCategory;
import com.sac.erp.modules.library.repository.BookCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookCategoryServiceImpl implements BookCategoryService {

    private final BookCategoryRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<BookCategory> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public BookCategory getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("BookCategory not found with id: " + id));
    }

    @Override
    @Transactional
    public BookCategory create(BookCategory entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public BookCategory update(Long id, BookCategory entity) {
        getById(id);
        entity.setId(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
