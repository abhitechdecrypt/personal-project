package com.movies.moviesservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.movies.moviesservice.entity.Cinema;

@Repository
public interface CinemRepo extends JpaRepository<Cinema, Long> {

}
