package com.sac.erp.modules.library.service;

import com.sac.erp.modules.library.entity.BookBank;
import com.sac.erp.modules.library.repository.BookBankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookBankServiceImpl implements BookBankService {

    private final BookBankRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<BookBank> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public BookBank getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("BookBank not found with id: " + id));
    }

    @Override
    @Transactional
    public BookBank create(BookBank entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public BookBank update(Long id, BookBank entity) {
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
