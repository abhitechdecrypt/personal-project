package com.movies.moviesservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.movies.moviesservice.entity.Movie;

@Repository
public interface MovieRepo extends JpaRepository<Movie, Long> {

}
