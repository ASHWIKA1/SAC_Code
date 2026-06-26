package com.sac.erp.modules.timetable.entity;

import com.sac.erp.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "sm_class_routines")
public class ClassRoutine extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Monday
    private String monday;
    @Column(name = "monday_start_from")
    private String mondayStartFrom;
    @Column(name = "monday_end_to")
    private String mondayEndTo;
    @Column(name = "monday_room_id")
    private Long mondayRoomId;

    // Tuesday
    private String tuesday;
    @Column(name = "tuesday_start_from")
    private String tuesdayStartFrom;
    @Column(name = "tuesday_end_to")
    private String tuesdayEndTo;
    @Column(name = "tuesday_room_id")
    private Long tuesdayRoomId;

    // Wednesday
    private String wednesday;
    @Column(name = "wednesday_start_from")
    private String wednesdayStartFrom;
    @Column(name = "wednesday_end_to")
    private String wednesdayEndTo;
    @Column(name = "wednesday_room_id")
    private Long wednesdayRoomId;

    // Thursday
    private String thursday;
    @Column(name = "thursday_start_from")
    private String thursdayStartFrom;
    @Column(name = "thursday_end_to")
    private String thursdayEndTo;
    @Column(name = "thursday_room_id")
    private Long thursdayRoomId;

    // Friday
    private String friday;
    @Column(name = "friday_start_from")
    private String fridayStartFrom;
    @Column(name = "friday_end_to")
    private String fridayEndTo;
    @Column(name = "friday_room_id")
    private Long fridayRoomId;

    // Saturday
    private String saturday;
    @Column(name = "saturday_start_from")
    private String saturdayStartFrom;
    @Column(name = "saturday_end_to")
    private String saturdayEndTo;
    @Column(name = "saturday_room_id")
    private Long saturdayRoomId;

    // Sunday
    private String sunday;
    @Column(name = "sunday_start_from")
    private String sundayStartFrom;
    @Column(name = "sunday_end_to")
    private String sundayEndTo;
    @Column(name = "sunday_room_id")
    private Long sundayRoomId;

    @Column(name = "active_status", nullable = false)
    private Integer activeStatus = 1;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "subject_id")
    private Long subjectId;
    @Column(name = "school_id")
    private String schoolId;

    @Column(name = "academic_id")
    private Long academicId;
}
