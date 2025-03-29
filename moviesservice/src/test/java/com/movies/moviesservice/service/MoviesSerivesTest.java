package com.movies.moviesservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.movies.moviesservice.entity.Cinema;
import com.movies.moviesservice.entity.Movie;
import com.movies.moviesservice.exception.MovieNotAvailableException;
import com.movies.moviesservice.repository.CinemRepo;
import com.movies.moviesservice.repository.MovieRepo;

class MoviesSerivesTest {

    @Mock
    private MovieRepo movieRepo;

    @Mock
    private CinemRepo cinemRepo;

    @InjectMocks
    private MoviesSerives moviesSerives;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateMovie_Success() {
        Cinema cinema = new Cinema();
        cinema.setId(1L);
        cinema.setBlocked(false);

        Set<Cinema> cinemas = new HashSet<>();
        cinemas.add(cinema);

        Movie movie = new Movie();
        movie.setCinemas(cinemas);

        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));
        when(movieRepo.save(movie)).thenReturn(movie);

        Movie createdMovie = moviesSerives.createMovie(movie);

        assertEquals(movie, createdMovie);
        verify(cinemRepo).findById(1L);
        verify(movieRepo).save(movie);
    }

    @Test
    void testCreateMovie_CinemaBlocked() {
        Cinema cinema = new Cinema();
        cinema.setId(1L);
        cinema.setBlocked(true);

        Set<Cinema> cinemas = new HashSet<>();
        cinemas.add(cinema);

        Movie movie = new Movie();
        movie.setCinemas(cinemas);

        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, () -> {
            moviesSerives.createMovie(movie);
        });

        assertEquals("Cinema is blocked and cannot be associated with a movie. Cinema ID: 1", exception.getMessage());
        verify(cinemRepo).findById(1L);
        verify(movieRepo, never()).save(movie);
    }

    @Test
    void testListMovie() {
        when(movieRepo.findAll()).thenReturn(Collections.emptyList());

        assertEquals(Collections.emptyList(), moviesSerives.listMovie());
        verify(movieRepo).findAll();
    }

    @Test
    void testFindMoviesById_MovieExists() {
        Movie movie = new Movie();
        movie.setId(1L);

        when(movieRepo.findById(1L)).thenReturn(Optional.of(movie));

        assertEquals(movie, moviesSerives.findMoviesById(1L));
        verify(movieRepo).findById(1L);
    }

    @Test
    void testFindMoviesById_MovieNotFound() {
        when(movieRepo.findById(1L)).thenReturn(Optional.empty());

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, () -> {
            moviesSerives.findMoviesById(1L);
        });

        assertEquals("Movie Not found", exception.getMessage());
        verify(movieRepo).findById(1L);
    }

    @Test
    void testGetCinemasByMovieId_Success() {
        Movie movie = new Movie();
        Set<Cinema> cinemas = new HashSet<>();
        movie.setCinemas(cinemas);

        when(movieRepo.findById(1L)).thenReturn(Optional.of(movie));

        assertEquals(cinemas, moviesSerives.getCinemasByMovieId(1L));
        verify(movieRepo).findById(1L);
    }

    @Test
    void testGetCinemasByMovieId_MovieNotFound() {
        when(movieRepo.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            moviesSerives.getCinemasByMovieId(1L);
        });

        assertEquals("Movie not found with id: 1", exception.getMessage());
        verify(movieRepo).findById(1L);
    }

    @Test
    void testBlockCinema_CinemaExistsAndBlock() {
        Cinema cinema = new Cinema();
        cinema.setId(1L);
        cinema.setBlocked(false);

        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));

        assertEquals("BLOCK", moviesSerives.blockCinema(1L));
        assertEquals(true, cinema.isBlocked());
        verify(cinemRepo).save(cinema);
    }

    @Test
    void testBlockCinema_CinemaExistsAndUnblock() {
        Cinema cinema = new Cinema();
        cinema.setId(1L);
        cinema.setBlocked(true);

        when(cinemRepo.findById(1L)).thenReturn(Optional.of(cinema));

        assertEquals("UNBLOCK", moviesSerives.blockCinema(1L));
        assertEquals(false, cinema.isBlocked());
        verify(cinemRepo).save(cinema);
    }

    @Test
    void testBlockCinema_CinemaNotFound() {
        when(cinemRepo.findById(1L)).thenReturn(Optional.empty());

        MovieNotAvailableException exception = assertThrows(MovieNotAvailableException.class, () -> {
            moviesSerives.blockCinema(1L);
        });

        assertEquals("The Cinem you are trying to block is Not Found", exception.getMessage());
        verify(cinemRepo).findById(1L);
    }
}
