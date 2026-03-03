package auth

import (
	"sync"
	"time"
)

type limiter struct {
	mu     sync.Mutex
	hits   map[string][]time.Time
	limit  int
	window time.Duration
}

func NewLimiter(limit int, window time.Duration) *limiter {
	return &limiter{
		hits:   make(map[string][]time.Time),
		limit:  limit,
		window: window,
	}
}

func (l *limiter) Allow(key string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	cut := now.Add(-l.window)

	arr := l.hits[key]
	// limpa
	j := 0
	for _, t := range arr {
		if t.After(cut) {
			arr[j] = t
			j++
		}
	}
	arr = arr[:j]

	if len(arr) >= l.limit {
		l.hits[key] = arr
		return false
	}

	arr = append(arr, now)
	l.hits[key] = arr
	return true
}
