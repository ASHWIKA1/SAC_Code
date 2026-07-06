package com.sac.erp.modules.library.service;

import com.sac.erp.modules.library.entity.*;
import com.sac.erp.modules.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {

    private final BookRepository bookRepository;
    private final LibraryMemberRepository libraryMemberRepository;
    private final BookIssueRepository bookIssueRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Book> getAllBooks() {
        return bookRepository.findByActiveStatus(1);
    }

    @Override
    @Transactional
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    @Transactional
    public LibraryMember addLibraryMember(LibraryMember member) {
        return libraryMemberRepository.save(member);
    }

    @Override
    @Transactional(readOnly = true)
    public LibraryMember getMemberByUniqueId(String cardId) {
        return libraryMemberRepository.findByMemberUniqueId(cardId)
                .orElseThrow(() -> new RuntimeException("Library Member card ID " + cardId + " not found"));
    }

    @Override
    @Transactional
    public BookIssue issueBook(Long bookId, String cardId, Integer days) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getQuantity() != null && book.getQuantity() <= 0) {
            throw new RuntimeException("Book copy not available in stock");
        }

        // Validate library member
        LibraryMember member = libraryMemberRepository.findByMemberUniqueId(cardId)
                .orElseThrow(() -> new RuntimeException("Member card ID not found"));

        if (book.getQuantity() != null) {
            book.setQuantity(book.getQuantity() - 1);
            bookRepository.save(book);
        }

        BookIssue issue = new BookIssue();
        issue.setBookId(bookId);
        issue.setMemberId(cardId);
        issue.setIssueDate(LocalDate.now());
        issue.setDueDate(LocalDate.now().plusDays(days != null ? days : 14));
        issue.setIssueStatus("I"); // Issued
        issue.setSchoolId(book.getSchoolId());

        return bookIssueRepository.save(issue);
    }

    @Override
    @Transactional
    public BookIssue returnBook(Long issueId) {
        BookIssue issue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Book Issue record not found"));

        if ("R".equalsIgnoreCase(issue.getIssueStatus())) {
            throw new RuntimeException("Book has already been returned");
        }

        Book book = bookRepository.findById(issue.getBookId())
                .orElseThrow(() -> new RuntimeException("Book associated with issue record not found"));

        if (book.getQuantity() != null) {
            book.setQuantity(book.getQuantity() + 1);
            bookRepository.save(book);
        }

        issue.setIssueStatus("R"); // Returned
        issue.setReturnDate(LocalDate.now());

        return bookIssueRepository.save(issue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookIssue> getIssuesByMember(String cardId) {
        return bookIssueRepository.findByMemberId(cardId);
    }
}
