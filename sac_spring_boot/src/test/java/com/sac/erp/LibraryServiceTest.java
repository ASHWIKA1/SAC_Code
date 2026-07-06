package com.sac.erp;

import com.sac.erp.modules.library.entity.Book;
import com.sac.erp.modules.library.entity.BookIssue;
import com.sac.erp.modules.library.entity.LibraryMember;
import com.sac.erp.modules.library.repository.BookIssueRepository;
import com.sac.erp.modules.library.repository.BookRepository;
import com.sac.erp.modules.library.repository.LibraryMemberRepository;
import com.sac.erp.modules.library.service.LibraryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class LibraryServiceTest {

    @Mock
    private BookRepository bookRepository;
    @Mock
    private LibraryMemberRepository libraryMemberRepository;
    @Mock
    private BookIssueRepository bookIssueRepository;

    @InjectMocks
    private LibraryServiceImpl libraryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testIssueBook_Success() {
        Book book = new Book();
        book.setId(1L);
        book.setQuantity(5);

        LibraryMember member = new LibraryMember();
        member.setMemberUniqueId("CARD_99");

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(libraryMemberRepository.findByMemberUniqueId("CARD_99")).thenReturn(Optional.of(member));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookIssueRepository.save(any(BookIssue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookIssue issue = libraryService.issueBook(1L, "CARD_99", 7);

        assertNotNull(issue);
        assertEquals("I", issue.getIssueStatus());
        assertEquals(4, book.getQuantity()); // 5 - 1 = 4
        verify(bookRepository, times(1)).save(book);
        verify(bookIssueRepository, times(1)).save(any(BookIssue.class));
    }

    @Test
    void testIssueBook_OutOfStock() {
        Book book = new Book();
        book.setId(1L);
        book.setQuantity(0); // Out of stock

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            libraryService.issueBook(1L, "CARD_99", 7);
        });

        assertTrue(exception.getMessage().contains("Book copy not available in stock"));
    }

    @Test
    void testReturnBook_Success() {
        BookIssue issue = new BookIssue();
        issue.setId(10L);
        issue.setBookId(1L);
        issue.setIssueStatus("I");

        Book book = new Book();
        book.setId(1L);
        book.setQuantity(4);

        when(bookIssueRepository.findById(10L)).thenReturn(Optional.of(issue));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(bookIssueRepository.save(any(BookIssue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookIssue returned = libraryService.returnBook(10L);

        assertNotNull(returned);
        assertEquals("R", returned.getIssueStatus());
        assertNotNull(returned.getReturnDate());
        assertEquals(5, book.getQuantity()); // 4 + 1 = 5
        verify(bookRepository, times(1)).save(book);
    }
}
