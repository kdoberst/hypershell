package users

import (
	"context"
	"sync"
	"time"

	"github.com/prometheus/client_golang/prometheus"
)

const (
	registeredMetricsNamespace = "hypershell"
	registeredMetricsSubsystem = "users"
	loginMetricsNamespace      = "hypershell"
	loginMetricsName           = "unique_user_logins_daily"
)

var (
	loginDailyVec    *prometheus.GaugeVec
	userMetricsOnce  sync.Once
	loginMetricsOnce sync.Once
)

const loginMetricsHelp = "Distinct human user logins per UTC calendar day (one count per user_id per day)."

// RegisterUserMetrics registers Prometheus gauges for registered user counts.
// Safe to call multiple times.
func RegisterUserMetrics(dao UserDao) {
	userMetricsOnce.Do(func() {
		prometheus.MustRegister(newRegisteredUsersCollector(dao))
	})
}

// RegisterUserLoginMetrics registers a Prometheus GaugeVec that reports distinct
// human-user login counts per UTC day for the trailing 30-day window. It is
// safe to call multiple times; subsequent calls are no-ops.
func RegisterUserLoginMetrics(dao UserDao) {
	loginMetricsOnce.Do(func() {
		loginDailyVec = prometheus.NewGaugeVec(
			prometheus.GaugeOpts{
				Namespace: loginMetricsNamespace,
				Name:      loginMetricsName,
				Help:      loginMetricsHelp,
			},
			[]string{"date"},
		)

		prometheus.MustRegister(newUserLoginCollector(dao))
	})
}

type registeredUsersCollector struct {
	dao  UserDao
	desc *prometheus.Desc
}

func newRegisteredUsersCollector(dao UserDao) *registeredUsersCollector {
	return &registeredUsersCollector{
		dao: dao,
		desc: prometheus.NewDesc(
			prometheus.BuildFQName(registeredMetricsNamespace, registeredMetricsSubsystem, "registered_total"),
			"Total registered users.",
			nil,
			nil,
		),
	}
}

func (c *registeredUsersCollector) Describe(ch chan<- *prometheus.Desc) {
	ch <- c.desc
}

func (c *registeredUsersCollector) Collect(ch chan<- prometheus.Metric) {
	count, err := c.dao.CountRegistered(context.Background())
	if err != nil {
		ch <- prometheus.NewInvalidMetric(c.desc, err)
		return
	}

	ch <- prometheus.MustNewConstMetric(c.desc, prometheus.GaugeValue, float64(count))
}

type userLoginCollector struct {
	dao  UserDao
	desc *prometheus.Desc
}

func newUserLoginCollector(dao UserDao) *userLoginCollector {
	return &userLoginCollector{
		dao: dao,
		desc: prometheus.NewDesc(
			prometheus.BuildFQName(loginMetricsNamespace, "", loginMetricsName),
			loginMetricsHelp,
			[]string{"date"},
			nil,
		),
	}
}

func (c *userLoginCollector) Describe(ch chan<- *prometheus.Desc) {
	ch <- c.desc
}

func (c *userLoginCollector) Collect(ch chan<- prometheus.Metric) {
	counts, err := c.dao.CountDistinctLoginsByDate(context.Background(), time.Now().UTC())
	if err != nil {
		ch <- prometheus.NewInvalidMetric(c.desc, err)
		return
	}

	for date, count := range counts {
		ch <- prometheus.MustNewConstMetric(c.desc, prometheus.GaugeValue, float64(count), date)
	}
}
