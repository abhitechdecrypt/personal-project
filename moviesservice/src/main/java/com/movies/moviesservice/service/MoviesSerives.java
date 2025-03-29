package com.movies.moviesservice.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.movies.moviesservice.entity.Cinema;
import com.movies.moviesservice.entity.Movie;
import com.movies.moviesservice.exception.MovieNotAvailableException;
import com.movies.moviesservice.repository.CinemRepo;
import com.movies.moviesservice.repository.MovieRepo;

import jakarta.transaction.Transactional;

@Service
public class MoviesSerives {

	@Autowired
	private MovieRepo movieRepo;

	@Autowired
	private CinemRepo cinemRepo;

	@Transactional
	public Movie createMovie(Movie movie) {
		// Validate and manage cinemas
		Set<Cinema> managedCinemas = movie.getCinemas().stream().map(cinema -> {
			Cinema managedCinema = cinemRepo.findById(cinema.getId())
					.orElseThrow(() -> new MovieNotAvailableException("Cinema not found with ID: " + cinema.getId(),
							String.valueOf(HttpStatus.NOT_FOUND.value())));

			if (managedCinema.isBlocked()) {
				throw new MovieNotAvailableException(
						"Cinema is blocked and cannot be associated with a movie. Cinema ID: " + cinema.getId(),
						String.valueOf(HttpStatus.FORBIDDEN.value()));
			}

			return managedCinema;
		}).collect(Collectors.toSet());

		// Set the managed cinemas back to the movie
		movie.setCinemas(managedCinemas);

		// Save the movie with the associated cinemas
		return movieRepo.save(movie);
	}

	public List<Movie> listMovie() {
		return movieRepo.findAll();
	}
	public Movie findMoviesById(long id) {
		return movieRepo.findById(id).orElseThrow(() -> new MovieNotAvailableException("Movie Not found", "404"));
	}

	public Movie finMoiveById(Long id) {
		return movieRepo.findById(id).get();
	}

	public Set<Cinema> getCinemasByMovieId(Long movieId) {
		Movie movie = movieRepo.findById(movieId)
				.orElseThrow(() -> new RuntimeException("Movie not found with id: " + movieId));
		return movie.getCinemas();
	}

	public Set<Movie> getMoviesByCinemaId(Long cinemaId) {
		Cinema cinema = cinemRepo.findById(cinemaId)
				.orElseThrow(() -> new RuntimeException("Cinema not found with id: " + cinemaId));
		return cinema.getMovies();
	}
	
	
	public Cinema getCinemaId(Long cinemaId) {
		Cinema cinema = cinemRepo.findById(cinemaId)
				.orElseThrow(() -> new RuntimeException("Cinema not found with id: " + cinemaId));
		return cinema;
	}

	public Cinema createCinema(Cinema cinema) {
		return cinemRepo.save(cinema);
	}


	public String blockCinema(Long id) {
		return cinemRepo.findById(id).map(cinema -> {
			if (!cinema.isBlocked()) {
				cinema.setBlocked(true);
				cinemRepo.save(cinema);
				return "BLOCK";
			}else if(cinema.isBlocked()){
				cinema.setBlocked(false);
				cinemRepo.save(cinema);
				return "UNBLOCK";
			}
			return "UNBLOCK";
		}).orElseThrow(() -> new MovieNotAvailableException("The Cinem you are trying to block is Not Found",
				String.valueOf(HttpStatus.NOT_FOUND.value())));
	}

	public List<Cinema> getlistOfCinemas() {
		return cinemRepo.findAll();
	}
}
