package com.sac.erp.modules.library.controller;

import com.sac.erp.modules.library.entity.*;
import com.sac.erp.modules.library.service.LibraryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping("/books")
    public ResponseEntity<List<Book>> getBooks() {
        log.info("REST request to get all active books");
        return ResponseEntity.ok(libraryService.getAllBooks());
    }

    @PostMapping("/books")
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        log.info("REST request to catalog book: {}", book.getBookTitle());
        return ResponseEntity.ok(libraryService.createBook(book));
    }

    @PostMapping("/members")
    public ResponseEntity<LibraryMember> addMember(@RequestBody LibraryMember member) {
        log.info("REST request to add library member: {}", member.getMemberUniqueId());
        return ResponseEntity.ok(libraryService.addLibraryMember(member));
    }

    @GetMapping("/members/{cardId}")
    public ResponseEntity<LibraryMember> getMemberByCard(@PathVariable String cardId) {
        log.info("REST request to get library member: {}", cardId);
        return ResponseEntity.ok(libraryService.getMemberByUniqueId(cardId));
    }

    @PostMapping("/books/issue")
    public ResponseEntity<BookIssue> issueBook(
            @RequestParam Long bookId,
            @RequestParam String cardId,
            @RequestParam(required = false) Integer days) {
        log.info("REST request to issue book ID: {} to card ID: {}", bookId, cardId);
        return ResponseEntity.ok(libraryService.issueBook(bookId, cardId, days));
    }

    @PostMapping("/books/return/{issueId}")
    public ResponseEntity<BookIssue> returnBook(@PathVariable Long issueId) {
        log.info("REST request to return book associated with issue ID: {}", issueId);
        return ResponseEntity.ok(libraryService.returnBook(issueId));
    }

    @GetMapping("/issues/member/{cardId}")
    public ResponseEntity<List<BookIssue>> getIssuesByMember(@PathVariable String cardId) {
        log.info("REST request to get all check-outs for card ID: {}", cardId);
        return ResponseEntity.ok(libraryService.getIssuesByMember(cardId));
    }
}
