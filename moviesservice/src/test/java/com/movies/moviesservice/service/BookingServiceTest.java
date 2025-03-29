package com.movies.moviesservice.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.movies.moviesservice.entity.Booking;
import com.movies.moviesservice.entity.Cinema;
import com.movies.moviesservice.entity.Movie;
import com.movies.moviesservice.exception.MovieNotAvailableException;
import com.movies.moviesservice.repository.BookingRepo;
import com.movies.moviesservice.repository.CinemRepo;
import com.movies.moviesservice.repository.MovieRepo;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepo bookingRepo;

    @Mock
    private CinemRepo cinemRepo;

    @Mock
    private MovieRepo movieRepo;

    @InjectMocks
    private BookingService bookingService;

    private Booking booking;
    private Cinema cinema;
    private Movie movie;

    @BeforeEach
    void setUp() {
        booking = new Booking();
        booking.setId(1L);
        booking.setName("John Doe");
        booking.setEmail("johndoe@example.com");
        booking.setBookingDate(LocalDateTime.now().plusDays(1));
        booking.setCinemaId(1L);
        booking.setMovieId(1L);
        booking.setSeats(10);
        booking.setBookingStatus("pending");

        cinema = new Cinema();
        cinema.setId(1L);
        cinema.setName("Cinema 1");
        cinema.setTotalSeats(100);
        cinema.setBlocked(false);

        movie = new Movie();
        movie.setId(1L);
        movie.setTitle("Movie 1");
        movie.setCinemas(Set.of(cinema));
    }

    @Test
    void testCreateBooking_Success() {
        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));
        when(movieRepo.findById(1L)).thenReturn(Optional.of(movie));
        when(bookingRepo.save(any(Booking.class))).thenReturn(booking);

        Booking result = bookingService.createBooking(booking);

        assertNotNull(result);
        assertEquals("booked", result.getBookingStatus());
        assertEquals(90, cinema.getTotalSeats());

        verify(cinemRepo).save(cinema);
        verify(bookingRepo).save(booking);
    }

    @Test
    void testCreateBooking_CinemaNotAvailable() {
        when(cinemRepo.findById(1L)).thenReturn(Optional.empty());

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, 
            () -> bookingService.createBooking(booking));

        assertEquals("Cinema is not Available to book", exception.getMessage());
        verify(bookingRepo, never()).save(any(Booking.class));
    }

    @Test
    void testCreateBooking_MovieNotAvailable() {
        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));
        when(movieRepo.findById(1L)).thenReturn(Optional.empty());

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, 
            () -> bookingService.createBooking(booking));

        assertEquals("Movie you are trying book is not available", exception.getMessage());
        verify(bookingRepo, never()).save(any(Booking.class));
    }

    @Test
    void testCreateBooking_CinemaNotPlayingMovie() {
        movie.setCinemas(Set.of()); // Movie is not playing in the cinema
        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));
        when(movieRepo.findById(1L)).thenReturn(Optional.of(movie));

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, 
            () -> bookingService.createBooking(booking));

        assertEquals("The selected cinema is not Playing with the movie John Doe", exception.getMessage());
        verify(bookingRepo, never()).save(any(Booking.class));
    }

    @Test
    void testCreateBooking_ExceedsSeatLimit() {
        booking.setSeats(101); // Exceed seat limit
        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));
        when(movieRepo.findById(1L)).thenReturn(Optional.of(movie));

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, 
            () -> bookingService.createBooking(booking));

        assertEquals("Only 100 seats can be booked by per personJohn Doe", exception.getMessage());
        verify(bookingRepo, never()).save(any(Booking.class));
    }

    @Test
    void testCreateBooking_CinemaBlocked() {
        cinema.setBlocked(true); // Cinema is blocked
        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));
        when(movieRepo.findById(1L)).thenReturn(Optional.of(movie));

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, 
            () -> bookingService.createBooking(booking));

        assertEquals("Cinema is blocked", exception.getMessage());
        verify(bookingRepo, never()).save(any(Booking.class));
    }

    @Test
    void testBookingCanclled_Success() {
        when(bookingRepo.findById(1L)).thenReturn(Optional.of(booking));
        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));

        String result = bookingService.bookingCanclled(1L);

        assertEquals("cancelled", result);
        assertEquals("Cancelled", booking.getBookingStatus());
        assertEquals(110, cinema.getTotalSeats());

        verify(bookingRepo).save(booking);
        verify(cinemRepo).save(cinema);
    }

    @Test
    void testBookingCanclled_BookingNotAvailable() {
        when(bookingRepo.findById(1L)).thenReturn(Optional.empty());

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, 
            () -> bookingService.bookingCanclled(1L));

        assertEquals("Booking You are trying to cancel is not available", exception.getMessage());
    }

    @Test
    void testBookingCanclled_CinemaNotAvailable() {
        when(bookingRepo.findById(1L)).thenReturn(Optional.of(booking));
        when(cinemRepo.findById(1L)).thenReturn(Optional.empty());

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, 
            () -> bookingService.bookingCanclled(1L));

        assertEquals("Cinema Not Found", exception.getMessage());
    }

    @Test
    void testBookingCanclled_DateInThePast() {
        booking.setBookingDate(LocalDateTime.now().minusDays(1)); // Date is in the past
        when(bookingRepo.findById(1L)).thenReturn(Optional.of(booking));
        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
            () -> bookingService.bookingCanclled(1L));

        assertEquals("Cannot cancel the booking as the date is in the past.", exception.getMessage());
    }
}
