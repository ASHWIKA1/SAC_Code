package com.sac.erp.modules.cms.controller;

import com.sac.erp.modules.cms.entity.*;
import com.sac.erp.modules.cms.service.CmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cms")
@RequiredArgsConstructor
public class CmsController {

    private final CmsService cmsService;

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses() {
        log.info("REST request to get all courses");
        return ResponseEntity.ok(cmsService.getAllCourses());
    }

    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        log.info("REST request to define course: {}", course.getTitle());
        return ResponseEntity.ok(cmsService.createCourse(course));
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getEvents() {
        log.info("REST request to get all events");
        return ResponseEntity.ok(cmsService.getAllEvents());
    }

    @PostMapping("/events")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        log.info("REST request to schedule event: {}", event.getEventTitle());
        return ResponseEntity.ok(cmsService.createEvent(event));
    }

    @GetMapping("/holidays")
    public ResponseEntity<List<Holiday>> getHolidays() {
        log.info("REST request to get all holidays");
        return ResponseEntity.ok(cmsService.getAllHolidays());
    }

    @PostMapping("/holidays")
    public ResponseEntity<Holiday> createHoliday(@RequestBody Holiday holiday) {
        log.info("REST request to register holiday: {}", holiday.getHolidayTitle());
        return ResponseEntity.ok(cmsService.createHoliday(holiday));
    }

    @GetMapping("/news")
    public ResponseEntity<List<News>> getNews() {
        log.info("REST request to get all news");
        return ResponseEntity.ok(cmsService.getAllNews());
    }

    @PostMapping("/news")
    public ResponseEntity<News> publishNews(@RequestBody News news) {
        log.info("REST request to publish news article: {}", news.getNewsTitle());
        return ResponseEntity.ok(cmsService.publishNews(news));
    }
}
