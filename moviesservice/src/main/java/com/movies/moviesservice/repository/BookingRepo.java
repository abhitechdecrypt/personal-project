package com.movies.moviesservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.movies.moviesservice.entity.Booking;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long>{
 List<Booking> findByEmail(String Email);
}
