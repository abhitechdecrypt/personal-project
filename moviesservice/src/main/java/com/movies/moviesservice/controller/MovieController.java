package com.movies.moviesservice.controller;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.movies.moviesservice.entity.Booking;
import com.movies.moviesservice.entity.Cinema;
import com.movies.moviesservice.entity.Movie;
import com.movies.moviesservice.service.BookingService;
import com.movies.moviesservice.service.MoviesSerives;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/api/v1/moviesapp")
public class MovieController {

	@Autowired
	private MoviesSerives moviesSerives;

	@Autowired
	private BookingService bookingService;

	@PostMapping("/movies")
	public Movie createMovie(@RequestBody Movie movie) {
		return moviesSerives.createMovie(movie);
	}

	@GetMapping("/movies")
	public List<Movie> findAll() {
		return moviesSerives.listMovie();
	}
	@GetMapping("/movies/{id}")
	public Movie getMoviesbyId(@PathVariable  Long id) {
		return moviesSerives.findMoviesById(id);
	}

	@GetMapping("/movies/{movieId}/cinemas")
	public ResponseEntity<Set<Cinema>> getCinemasByMovieId(@PathVariable Long movieId) {
		Set<Cinema> cinemas = moviesSerives.getCinemasByMovieId(movieId);
		if (cinemas.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(cinemas);
	}

	@GetMapping("/cinemas/{cinemaId}/movies")
	public ResponseEntity<Set<Movie>> getMoviesByCinemaId(@PathVariable Long cinemaId) {
		Set<Movie> movies = moviesSerives.getMoviesByCinemaId(cinemaId);
		if (movies.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(movies);
	}
	
	@GetMapping("/cinemas/{cinemaId}")
	public ResponseEntity<?> getCinemaById(@PathVariable Long cinemaId) {
		Cinema movies = moviesSerives.getCinemaId(cinemaId);
		
		return ResponseEntity.ok(movies);
	}

	@PostMapping("/cinemas")
	public ResponseEntity<Cinema> createCinema(@RequestBody Cinema cinema) {
		Cinema createdCinema = moviesSerives.createCinema(cinema);
		return ResponseEntity.ok(createdCinema);
	}

	@GetMapping("/cinemas")
	public ResponseEntity<?> getListOfCinemas() {
		List<Cinema> createdCinema = moviesSerives.getlistOfCinemas();
		return ResponseEntity.ok(createdCinema);
	}

	@PutMapping("/cinema/block/{block}")
	public ResponseEntity<String> blockCinema(@PathVariable(value = "block") Long id) {
		String blockCinema = moviesSerives.blockCinema(id);
		if (blockCinema.equals("BLOCK")) {
			return ResponseEntity.status(HttpStatus.OK).body("Cinema has been blocked successfully.");
		} else
			return ResponseEntity.status(HttpStatus.OK).body("Cinema has been unblocked successfully.");
	}

	@PostMapping("/booking")
	public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
		Booking bookingData = bookingService.createBooking(booking);
		return ResponseEntity.status(HttpStatus.CREATED).body(bookingData);
	}

	@GetMapping("/booking")
	public ResponseEntity<?> findBooking(
	    @RequestParam(value = "email", required = false) String email,
	    @RequestParam(value = "bookingId", required = false) Long bookingId) {

	    if (email != null && bookingId == null) {
	        List<Booking> bookings = bookingService.findBookingByEmail(email);
	        return ResponseEntity.status(HttpStatus.OK).body(bookings);
	    } else if (email == null && bookingId != null) {
	        Booking booking = bookingService.findById(bookingId);
	        return ResponseEntity.status(HttpStatus.OK).body(booking);
	    } else {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	            .body("Please provide either 'email' or 'bookingId' parameter, not both.");
	    }
	}

//	@PutMapping("/booking/{bookingId}")
//	public ResponseEntity<?> cancelBooking(@PathParam(value = "cancel") String cancel, Long bookingId) {
//		String bookingCanclled = bookingService.bookingCanclled(bookingId);
//		if (bookingCanclled.equalsIgnoreCase("cancelled")) {
//			return ResponseEntity.status(HttpStatus.OK).body("Booking cancelled Successfully");
//		} else {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancelled the Booking");
//		}
//	}

//	@PutMapping("/booking/{bookingId}")
//	public ResponseEntity<?> cancelBooking(@PathParam(value = "cancel") String cancel, Long bookingId) {
//	    String bookingCancelled = bookingService.bookingCanclled(bookingId);
//	    if ("cancelled".equalsIgnoreCase(bookingCancelled)) {
//	        return ResponseEntity.status(HttpStatus.OK).body("Booking cancelled Successfully");
//	    } else {
//	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancel the Booking");
//	    }
//	}

	@PutMapping("/booking/{bookingId}")
	public ResponseEntity<String> cancelBooking(@RequestParam(value = "cancel") String cancel, 
	                                             @PathVariable Long bookingId) {
	    if (cancel == null || !Boolean.parseBoolean(cancel)) {
	        return ResponseEntity.badRequest().body("Invalid request parameter");
	    }
	    
	    String bookingCancelled = bookingService.bookingCanclled(bookingId);
	    
	    if ("cancelled".equalsIgnoreCase(bookingCancelled)) {
	        return ResponseEntity.status(HttpStatus.OK).body("Booking cancelled Successfully");
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancel the Booking");
	    }
	}
}
