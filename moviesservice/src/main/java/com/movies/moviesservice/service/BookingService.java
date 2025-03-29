package com.movies.moviesservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.movies.moviesservice.entity.Booking;
import com.movies.moviesservice.entity.Cinema;
import com.movies.moviesservice.entity.Movie;
import com.movies.moviesservice.exception.MovieNotAvailableException;
import com.movies.moviesservice.repository.BookingRepo;
import com.movies.moviesservice.repository.CinemRepo;
import com.movies.moviesservice.repository.MovieRepo;

@Service
public class BookingService {
	
	Logger logger = LoggerFactory.getLogger(BookingService.class);

	@Autowired
	private BookingRepo bookingRepo;
	@Autowired
	private CinemRepo cinemRepo;
	@Autowired
	private MovieRepo movieRepo;

	public Booking createBooking(Booking booking) {
		
		Cinema cinema = cinemRepo.findById(booking.getCinemaId()).orElseThrow(()-> new MovieNotAvailableException("Cinema is not Available to book","404"));
		Movie movie = movieRepo.findById(booking.getMovieId()).orElseThrow(()-> new MovieNotAvailableException("Movie you are trying book is not available","404"));
        logger.info("Cinema Data Found => "+cinema);
        logger.info("Movies Data Found => "+movie);
        if(booking.getEmail()==null || booking.getName() ==null) {
        	throw new MovieNotAvailableException("Email or Name Field is required", "404");
        }
        
		if (!movie.getCinemas().contains(cinema)) {
            throw new MovieNotAvailableException("The selected cinema is not Playing with the movie "+booking.getName(), "404");
        }
		if(booking.getSeats()>100) {
			throw new MovieNotAvailableException("Only 100 seats can be booked by per person"+booking.getName(), "404");
		}
        if (!cinema.isBlocked() && cinema.getTotalSeats() >= booking.getSeats()) {
            cinema.setTotalSeats(cinema.getTotalSeats() - booking.getSeats());
            cinemRepo.save(cinema);
            booking.setBookingStatus("booked");
            logger.info("Booking Created successfully => "+booking);
            return bookingRepo.save(booking);
        } else {
        	logger.info("Cinema is Blocked so You can't => "+booking.getCinemaId());
            String message = cinema.isBlocked() ? "Cinema is blocked" : "Insufficient seats available";
            throw new MovieNotAvailableException(message, "404");
        }
	}
	
	public List<Booking> findBookingByEmail(String email) {
		return bookingRepo.findByEmail(email);
	}
	
	public Booking findById(Long id) {
		return bookingRepo.findById(id).orElseThrow(() -> new MovieNotAvailableException("The Booking You are trying to find is not available.", "404"));
	}
	
	public String bookingCanclled(Long bookingId) {
		
		Booking booking = bookingRepo.findById(bookingId).orElseThrow(()-> new MovieNotAvailableException("Booking You are trying to cancel is not available", "404"));
		Cinema cinema = cinemRepo.findById(booking.getCinemaId()).orElseThrow(() -> new MovieNotAvailableException("Cinema Not Found", "404"));
		logger.info("Cancellation Process started");
		if (booking.getBookingDate().isAfter(LocalDateTime.now())) {
	        booking.setBookingStatus("Cancelled");
	        cinema.setTotalSeats(cinema.getTotalSeats()+booking.getSeats());
	        bookingRepo.save(booking);
	        cinemRepo.save(cinema);
	        logger.info("Cancellation Process End");
	        return "cancelled";
	    } else {
	        throw new IllegalArgumentException("Cannot cancel the booking as the date is in the past.");
	    }
		
	}
}
